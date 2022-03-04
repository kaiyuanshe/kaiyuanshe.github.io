import { Day } from 'web-utility';
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { setCookie, destroyCookie } from 'nookies';

import { call } from '../base';
import { User } from './index';

const { NODE_ENV } = process.env;

export async function sessionOf(request: GetServerSidePropsContext['req']) {
  const user = await call<User>('users/me', 'GET', null, request);

  return { ...user, token: request.cookies.token };
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse<User>,
) => {
  switch (request.method) {
    case 'POST': {
      const data = await call('auth/local', 'POST', request.body);

      setCookie({ res: response }, 'token', data.jwt, {
        httpOnly: true,
        secure: NODE_ENV !== 'development',
        maxAge: 30 * Day,
        path: '/',
      });
      return response.writeHead(302, { Location: '/' }).end();
    }
    case 'GET':
      if ('delete' in request.query) {
        destroyCookie({ res: response }, 'token', { path: '/' });

        return response.writeHead(302, { Location: '/' }).end();
      } else
        try {
          const { id } = await sessionOf(request);
          const user = await call(`users/${id}`, 'GET', null, request);

          return response.send(user);
        } catch {
          return response.status(401).end();
        }
    case 'PATCH': {
      const { id } = await sessionOf(request);

      const user = await call<User>(
        `users/${id}`,
        'PUT',
        request.body,
        request,
      );
      response.send(user);
    }
  }
};

export function setSession(user: User) {
  if (globalThis.localStorage) localStorage.user = JSON.stringify(user);
}

export function getSession(): User {
  return globalThis.localStorage?.user ? JSON.parse(localStorage.user) : {};
}
