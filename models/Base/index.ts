import { HTTPClient } from 'koajax';
import { makeSimpleFilter, TableCellValue } from 'mobx-lark';
import { DataObject, Filter, ListModel } from 'mobx-restful';
import { isEmpty } from 'web-utility';

export const isServer = () => typeof window === 'undefined';

const VercelHost = process.env.VERCEL_URL,
  GithubToken = process.env.GITHUB_TOKEN;

export const API_Host = isServer()
  ? VercelHost
    ? `https://${VercelHost}`
    : 'http://localhost:3000'
  : globalThis.location.origin;

export const KYS_SERVICE_HOST = process.env.NEXT_PUBLIC_KYS_SERVICE_HOST;

export const client = new HTTPClient({
  baseURI: `${API_Host}/api/`,
  responseType: 'json',
});

export const larkClient = new HTTPClient({
  baseURI: `${API_Host}/api/lark/`,
  responseType: 'json',
});

export const blobClient = new HTTPClient({
  baseURI: 'https://ows.blob.core.chinacloudapi.cn/$web/',
  responseType: 'arraybuffer',
});

export const fileBaseURI = blobClient.baseURI + 'file';

export const blobURLOf = (value: TableCellValue) =>
  value instanceof Array
    ? typeof value[0] === 'object' &&
      ('file_token' in value[0] || 'attachmentToken' in value[0])
      ? `${fileBaseURI}/${value[0].name}`
      : ''
    : value + '';

export const githubClient = new HTTPClient({
  baseURI: isServer() ? 'https://api.github.com/' : `${API_Host}/api/github/`,
  responseType: 'json',
}).use(({ request }, next) => {
  if (GithubToken)
    request.headers = {
      ...request.headers,
      Authorization: `Bearer ${GithubToken}`,
    };
  return next();
});

export type LarkBase = Record<string, TableCellValue>;

export interface SearchableModel<
  D extends DataObject,
  F extends Filter<D> = Filter<D>,
> extends ListModel<D, F> {
  searchKeys: readonly (keyof D)[];

  getSearchList(
    keywords: string,
    pageIndex?: number,
    pageSize?: number,
  ): Promise<D[]>;
}

export const makeFilter = (filter: Filter<any>) =>
  isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');

export async function getSearchList(
  this: SearchableModel<any>,
  keywords: string,
  pageIndex = this.pageIndex + 1,
  pageSize = this.pageSize,
) {
  const wordList = keywords.split(/[\s,]+/);
  const filterList = this.searchKeys.map(key => [key, wordList]);

  return this.getList(Object.fromEntries(filterList), pageIndex, pageSize);
}
