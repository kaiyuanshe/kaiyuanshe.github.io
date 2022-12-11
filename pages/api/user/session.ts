import { Day } from 'web-utility';
import { ServerResponse } from 'http';
import { GetServerSidePropsContext, NextApiResponse } from 'next';
import { destroyCookie } from 'nookies';

import { request, safeAPI, writeCookie } from '../base';
import { User } from './index';

export async function sessionOf(
  req: GetServerSidePropsContext['req'],
): Promise<User> {
  const user = await request<User>('users/me', 'GET', null, { req });

  return { ...user, token: req.cookies.token };
}

export function signOut(response: ServerResponse) {
  destroyCookie({ res: response }, 'token', { path: '/' });

  response.writeHead(302, { Location: '/' }).end();
}

export default safeAPI(async (req, res: NextApiResponse<User>) => {
  switch (req.method) {
    case 'POST': {
      const data = await request<{ jwt: string }>(
        'auth/local',
        'POST',
        req.body,
      );
      writeCookie(res, 'token', data.jwt, Date.now() + 30 * Day);

      return res.writeHead(302, { Location: '/' }).end();
    }
    case 'GET': {
      if ('delete' in req.query) return signOut(res);

      try {
        const { id, token } = await sessionOf(req);
        const user = await request<User>(`users/${id}`, 'GET', null, { req });

        return res.send({ ...user, token });
      } catch {
        return res.status(401).end();
      }
    }
    case 'PATCH': {
      const { id } = await sessionOf(req);

      const user = await request<User>(`users/${id}`, 'PUT', req.body, { req });

      res.send(user);
    }
  }
});

export function setSession(user: User) {
  if (globalThis.localStorage) localStorage.user = JSON.stringify(user);
}

export function getSession(): User {
  return globalThis.localStorage?.user ? JSON.parse(localStorage.user) : {};
}

export const getClientSession = () => request<User>('user/session');
