import 'core-js/full/array/from-async';

import { HTTPClient } from 'koajax';
import { TableCellValue } from 'mobx-lark';

export const isServer = () => typeof window === 'undefined';

const VercelHost = process.env.VERCEL_URL;

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
