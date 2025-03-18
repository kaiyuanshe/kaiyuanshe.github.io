import { marked } from 'marked';
import {
  LarkApp,
  LarkData,
  normalizeTextArray,
  TableCellText,
} from 'mobx-lark';

import { safeAPI } from '../base';

export const LARK_APP_ID = process.env.LARK_APP_ID!,
  LARK_APP_SECRET = process.env.LARK_APP_SECRET!;

export const lark = new LarkApp({
  id: LARK_APP_ID,
  secret: LARK_APP_SECRET,
});

export const normalizeMarkdownArray = (list: TableCellText[]) =>
  normalizeTextArray(list).map(text => marked(text) as string);

export const proxyLark = <T extends LarkData>(
  dataFilter?: (path: string, data: T) => T,
) =>
  safeAPI(async ({ method, url, headers, body }, response) => {
    await lark.getAccessToken();

    delete headers.host;

    const path = url!.slice(`/api/Lark/`.length);

    const { status, body: data } = await lark.client.request<T>({
      // @ts-expect-error Type compatibility issue
      method,
      path,
      // @ts-expect-error Type compatibility issue
      headers,
      body: body || undefined,
    });

    response.status(status);

    response.send(dataFilter?.(path, data!) || data);
  });
