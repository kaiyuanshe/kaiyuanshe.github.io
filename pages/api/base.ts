import type { TypeKeys } from 'web-utility';
import { merge } from 'lodash';
import { parse, stringify } from 'qs';
import type { GetServerSidePropsContext } from 'next';

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface Base {
  id: number;
  created_at: string;
  updated_at?: string;
  published_at?: string;
}

export interface Media extends Base {
  created_by?: string;
  updated_by?: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: any;
  hash: string;
  ext?: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: any;
  related?: string;
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

interface ErrorItem<T> {
  messages: Record<keyof T, string>[];
}

interface ValidationError<T> {
  errors: Record<keyof T, string[]>;
}

interface UploadError {
  errors: { id: string; message: string }[];
}

export interface ErrorData<T = any> {
  statusCode: number;
  error: string;
  message: ErrorItem<T>[];
  data?: ErrorItem<T>[] | ValidationError<T> | UploadError;
}

const { location } = globalThis,
  { NEXT_PUBLIC_API_HOST } = process.env;

async function messageOf(response: Response) {
  if (response.status !== 400) return response.statusText;

  const { data } = (await response.json()) as ErrorData;

  const message =
    data instanceof Array
      ? data.map(({ messages }) => messages.map(item => Object.values(item)))
      : data?.errors instanceof Array
      ? data.errors.map(({ message }) => message)
      : data?.errors
      ? Object.entries(data.errors).map(item => item[1])
      : [];

  return message.flat().join('\n') || response.statusText;
}

export async function call<T = any>(
  path: string,
  method: HTTPMethod = 'GET',
  body?: any,
  request?: GetServerSidePropsContext['req'],
  header?: Record<string, string>,
) {
  const { token = '' } = request?.cookies || {},
    noStringify =
      !body ||
      typeof body !== 'object' ||
      (body?.constructor && body.constructor !== Object);

  var headers = token
    ? { Authorization: `Bearer ${token}`, ...header }
    : header;
  headers = noStringify
    ? headers
    : { 'Content-Type': 'application/json', ...headers };

  path =
    new URL(
      path,
      location?.origin ? `${location.origin}/api/` : NEXT_PUBLIC_API_HOST,
    ) + '';

  const response = await fetch(path, {
    method,
    headers,
    body: noStringify ? body : JSON.stringify(body),
  });

  if (response.status < 300)
    return response.status === 204
      ? ({} as T)
      : (response.json() as Promise<T>);

  console.error(path);
  console.trace('HTTP API call');

  throw new URIError(await messageOf(response));
}

export function makePagination(index: number, size: number) {
  return stringify({
    _start: (index - 1) * size,
    _limit: size,
  });
}

export function makeSearch<T extends Base>(
  keys: Exclude<TypeKeys<T, string>, 'id'>[],
  keywords: string,
) {
  const words = keywords.split(/\s+/);

  const _or = keys
    .map(key => words.map(word => ({ [`${key}_contains`]: word })))
    .flat();

  return stringify({ _where: { _or } });
}

export function mergeQuery(path: string, ...data: Record<string, any>[]) {
  const [route, query] = path.split('?');

  return `${route}?${stringify(merge(parse(query), ...data))}`;
}

export async function getPage<T>(
  path: string,
  request: GetServerSidePropsContext['req'],
  pageIndex = 1,
  pageSize = 10,
) {
  const [route, query = ''] = path.split('?');

  const count = await call<number>(
    [`${route}/count`, query].join('?'),
    'GET',
    null,
    request,
  );
  if (!count) return { pageIndex, pageSize, pageCount: 0, count, list: [] };

  const list = await call<T[]>(
    mergeQuery(path, parse(makePagination(pageIndex, pageSize))),
    'GET',
    null,
    request,
  );
  return {
    pageIndex,
    pageSize,
    pageCount: Math.ceil(count / pageSize),
    count,
    list,
  };
}
