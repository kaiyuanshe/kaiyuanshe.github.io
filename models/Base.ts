import { HTTPClient } from 'koajax';

export const isServer = () => typeof window === 'undefined';

export const StaticRoot =
  'https://communitymap01.blob.core.chinacloudapi.cn/$web';

export const staticImageURLOf = (name: string) =>
  `${StaticRoot}/${(name + '').replace(/\s+/g, '-')}.png`;

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
