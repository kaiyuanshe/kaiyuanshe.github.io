import { TimeData } from 'web-utility';
import { ServerResponse } from 'http';
import { HTTPError, Request, request as call } from 'koajax';
import { setCookie } from 'nookies';
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from 'next';

import { getClientSession } from './user/session';
import { StrapiError } from './base';

const BackHost = process.env.NEXT_PUBLIC_API_HOST;
const Host =
  typeof window !== 'undefined'
    ? new URL('/api/', location.origin) + ''
    : BackHost;

export async function request<T = void>(
  path: string,
  method?: Request['method'],
  body?: any,
  context?: Partial<GetServerSidePropsContext>,
  headers: Record<string, any> = {},
) {
  const token = context?.req && readCookie(context.req, 'token');

  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  } catch {}

  const { response } = call<T>({
    path: new URL(path, Host) + '',
    method,
    body,
    headers,
    responseType: 'json',
  });
  const { status, statusText, body: data } = await response;

  if (status < 300) return data!;

  console.error(path);
  console.error(data);
  console.trace('HTTP API call');

  const { error } = (data || {}) as { error?: StrapiError };

  const message = typeof error === 'object' ? error.message : statusText;

  throw new HTTPError(message, await response);
}

/**
 * 客户端直接请求后端
 */
export async function requestClient<T = void>(
  path: string,
  method: Request['method'] = 'GET',
  body?: any,
  headers: Record<string, any> = {},
) {
  try {
    const { token } = await getClientSession();

    headers = { Authorization: `token ${token}`, ...headers };
  } catch {}

  try {
    return request<T>(new URL(path, BackHost) + '', method, body, {}, headers);
  } catch (error) {
    if (error instanceof HTTPError)
      location.href =
        error.status === 401 ? '/user/sign-in' : `/${error.status}`;

    throw error;
  }
}

export type NextAPI = (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<any>;

export function safeAPI(handler: NextAPI): NextAPI {
  return async (req, res) => {
    try {
      return await handler(req, res);
    } catch (error) {
      if (error instanceof HTTPError) {
        res.status(error.status);
        res.statusMessage = error.message;
        res.send(error.body);
      }
    }
  };
}

const Env = process.env.NODE_ENV;

export function writeCookie(
  res: ServerResponse,
  key: string,
  value: string,
  expiredAt: TimeData,
) {
  setCookie({ res }, key, value, {
    httpOnly: true,
    secure: Env !== 'development',
    maxAge: +new Date(expiredAt) - Date.now(),
    path: '/',
  });
}

export function readCookie(req: GetServerSidePropsContext['req'], key: string) {
  return req.cookies[key];
}
