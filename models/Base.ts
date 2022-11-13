import { HTTPClient } from 'koajax';
import { TableCellValue } from 'lark-ts-sdk';

export const isServer = () => typeof window === 'undefined';

export const client = new HTTPClient({
  baseURI: `${
    isServer() ? process.env.NEXT_PUBLIC_API_HOST! : globalThis.location?.origin
  }/api/`,
  responseType: 'json',
});

export const blobClient = new HTTPClient({
  baseURI: 'https://ows.blob.core.chinacloudapi.cn/$web/',
  responseType: 'arraybuffer',
});

export const fileBaseURI = blobClient.baseURI + 'file';

export const blobURLOf = (value: TableCellValue) =>
  value instanceof Array
    ? typeof value[0] === 'object' && 'file_token' in value[0]
      ? `${fileBaseURI}/${value[0].name}`
      : ''
    : '';
