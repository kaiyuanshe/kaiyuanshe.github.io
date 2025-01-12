import { HTTPClient } from 'koajax';

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
