import { HTTPClient } from 'koajax';

export const isServer = () => typeof window === 'undefined';

export const StaticRoot =
  'https://communitymap01.blob.core.chinacloudapi.cn/$web';

export const client = new HTTPClient({
  baseURI: 'http://localhost:3000',
  responseType: 'json',
});
