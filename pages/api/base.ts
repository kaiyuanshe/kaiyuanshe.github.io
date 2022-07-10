import type { TypeKeys } from 'web-utility';
import { merge } from 'lodash';
import { parse, stringify } from 'qs';
import type { GetServerSidePropsContext } from 'next';

import { Media } from './file';
import { signOut } from './user/session';

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

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

const { location } = globalThis,
  { NEXT_PUBLIC_API_HOST } = process.env;

export async function call<T = any>(
  path: string,
  method: HTTPMethod = 'GET',
  body?: any,
  context?: Partial<GetServerSidePropsContext>,
  header?: Record<string, string>,
): Promise<T> {
  const { token = '' } = context?.req?.cookies || {},
    noStringify =
      !body || typeof body !== 'object' || body.constructor !== Object;

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

  if (
    response.headers
      .get('Content-Type')
      ?.match(/^(application\/json|text\/plain)/)
  )
    var data = await response.json();

  if (response.status < 300) return data;

  console.error(path);
  console.error(data);
  console.trace('HTTP API call');

  const message =
    typeof data?.error === 'object'
      ? (data.error as StrapiError).message
      : response.statusText;

  if (!context?.res) throw new URIError(message);

  signOut(context.res);
  return data;
}

export function makePagination(index: number, size: number) {
  return stringify(
    { pagination: { page: index, pageSize: size } },
    { encodeValuesOnly: true },
  );
}

export function makeSearch<T extends Base>(
  keys: Exclude<TypeKeys<T, string>, 'id'>[],
  keywords: string,
) {
  const words = keywords.split(/\s+/);

  const $or = keys
    .map(key => words.map(word => ({ [key]: { $containsi: word } })))
    .flat();

  return stringify({ filters: { $or } }, { encodeValuesOnly: true });
}

export function mergeQuery(path: string, ...data: Record<string, any>[]) {
  const [route, query] = path.split('?');

  return `${route}?${stringify(merge(parse(query), ...data), {
    encodeValuesOnly: true,
  })}`;
}

export async function getPage<T>(
  path: string,
  context: Partial<GetServerSidePropsContext>,
  pageIndex = 1,
  pageSize = 10,
) {
  const { meta, data } = await call<DataBox<T[]>>(
    mergeQuery(path, parse(makePagination(pageIndex, pageSize))),
    'GET',
    null,
    context,
  );
  const { page, total, ...pagination } = meta!.pagination;

  return {
    pageIndex: page,
    ...pagination,
    count: total,
    list: data,
  };
}

export async function getPageV3<T>(
  path: string,
  context: Partial<GetServerSidePropsContext>,
  pageIndex = 1,
  pageSize = 10,
) {
  const [route, query = ''] = path.split('?');
  const { sort, ...filter } = parse(query);
  const search = stringify(filter, { encodeValuesOnly: true });

  const count = await call<number>(
    [`${route}/count`, search].join('?'),
    'GET',
    null,
    context,
  );
  if (!count) return { pageIndex, pageSize, pageCount: 0, count, list: [] };

  const list = await call<T[]>(
    mergeQuery(path, parse(makePagination(pageIndex, pageSize))),
    'GET',
    null,
    context,
  );
  return {
    pageIndex,
    pageSize,
    pageCount: Math.ceil(count / pageSize),
    count,
    list,
  };
}
