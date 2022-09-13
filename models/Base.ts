import { HTTPClient } from 'koajax';

export const isServer = () => typeof window === 'undefined';

export const client = new HTTPClient({ responseType: 'json' });
