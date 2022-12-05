import type { TypeKeys, TimeData } from 'web-utility';
import { merge } from 'lodash';
import { ParsedUrlQuery } from 'querystring';
import { parse, stringify } from 'qs';
import { ServerResponse } from 'http';
import { setCookie } from 'nookies';
import { HTTPError, Request, request as call } from 'koajax';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import { parseLanguageHeader } from 'mobx-i18n';

import { i18n } from '../../models/Translation';
import { Media } from './file';
import { getClientSession } from './user/session';

export interface Base {
  id: number;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
}

export type NewData<T extends Base> = {
  [K in keyof T]: T[K] extends Media
    ? Blob
    : T[K] extends Media[]
    ? Blob[]
    : T[K] extends Base
    ? number
    : T[K] extends Base[]
    ? number[]
    : T[K];
};

export type NewForm<T extends Base> = Omit<
  T,
  TypeKeys<Required<T>, Media | Media[]>
> & {
  [K in TypeKeys<Required<T>, Media>]: string;
} & {
  [K in TypeKeys<Required<T>, Media[]>]: string[];
};

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface StrapiError {
  status: number;
  name: string;
  message: string;
  details: any;
}

export interface DataBox<T> {
  data: T;
  meta?: T extends any[] ? { pagination: Pagination } : {};
  error?: StrapiError;
}

const BackHost = process.env.NEXT_PUBLIC_API_HOST;
const Host =
  typeof window !== 'undefined'
    ? new URL('/api/', location.origin) + ''
    : BackHost;

export async function request<T = void>(
  path: string,
  method: Request['method'] = 'GET',
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
      if (!(error instanceof HTTPError)) {
        console.error(error);
        return res.end(error);
      }
      let { message, status, body } = error;

      res.status(status);
      res.statusMessage = message;

      if (body instanceof ArrayBuffer)
        try {
          body = new TextDecoder().decode(new Uint8Array(body));
          console.error(body);

          body = JSON.parse(body);
          console.error(body);
        } catch {}

      res.send(body);
    }
  };
}

interface RouteProps<T extends ParsedUrlQuery> {
  route: Pick<
    GetServerSidePropsContext<T>,
    'resolvedUrl' | 'params' | 'query' | 'locales'
  >;
}

export function withRoute<
  R extends Record<string, any>,
  P extends Record<string, any> = {},
  O extends GetServerSideProps<P, R> = GetServerSideProps<P, R>,
>(
  origin?: O,
): GetServerSideProps<RouteProps<R> & InferGetServerSidePropsType<O>, R> {
  return async context => {
    const options =
        (await origin?.(context)) || ({} as GetServerSidePropsResult<{}>),
      { resolvedUrl, params, query, locales } = context;

    return {
      ...options,
      props: {
        ...('props' in options ? options.props : {}),
        route: JSON.parse(
          JSON.stringify({ resolvedUrl, params, query, locales }),
        ),
      },
    } as GetServerSidePropsResult<
      RouteProps<R> & InferGetServerSidePropsType<O>
    >;
  };
}

export function withTranslation<
  R extends Record<string, any>,
  P extends Record<string, any> = {},
  O extends GetServerSideProps<P, R> = GetServerSideProps<P, R>,
>(
  origin?: O,
): GetServerSideProps<RouteProps<R> & InferGetServerSidePropsType<O>, R> {
  return async context => {
    const options =
      (await origin?.(context)) || ({} as GetServerSidePropsResult<{}>);

    const languages = parseLanguageHeader(
      context.req.headers['accept-language'] || '',
    );
    await i18n.loadLanguages(languages);

    return options as GetServerSidePropsResult<
      RouteProps<R> & InferGetServerSidePropsType<O>
    >;
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

export function mergeQuery(path: string, ...data: Record<string, any>[]) {
  const [route, query] = path.split('?');

  return `${route}?${stringify(merge(parse(query), ...data), {
    encodeValuesOnly: true,
  })}`;
}
