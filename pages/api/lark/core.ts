import { marked } from 'marked';
import {
  LarkApp,
  LarkData,
  normalizeText,
  TableCellLocation,
  TableCellText,
  TableCellValue,
} from 'mobx-lark';

import { safeAPI } from '../base';

export const LARK_APP_ID = process.env.LARK_APP_ID!,
  LARK_APP_SECRET = process.env.LARK_APP_SECRET!;

export const lark = new LarkApp({
  id: LARK_APP_ID,
  secret: LARK_APP_SECRET,
});

export interface TableFormViewItem
  extends Record<'name' | 'description' | 'shared_url', string>,
    Record<'shared' | 'submit_limit_once', boolean> {
  shared_limit: 'tenant_editable';
}
export type LarkFormData = LarkData<{ form: TableFormViewItem }>;

export const normalizeTextArray = (list: TableCellText[]) =>
  list.reduce(
    (sum, item) => {
      if (item.text === ',') sum.push('');
      else sum[sum.length - 1] += normalizeText(item);

      return sum;
    },
    [''],
  );

export const normalizeMarkdownArray = (list: TableCellText[]) =>
  normalizeTextArray(list).map(text => marked(text) as string);

export function coordinateOf(location: TableCellValue): [number, number] {
  const [longitude, latitude] = (location as TableCellLocation)?.location.split(
    ',',
  );
  return [+latitude, +longitude];
}

export const proxyLark = <T extends LarkData>(
  dataFilter?: (path: string, data: T) => T,
) =>
  safeAPI(async ({ method, url, headers, body }, response) => {
    await lark.getAccessToken();

    delete headers.host;

    const path = url!.slice(`/api/Lark/`.length);

    const { status, body: data } = await lark.client.request<T>({
      // @ts-ignore
      method,
      path,
      // @ts-ignore
      headers,
      body: body || undefined,
    });

    response.status(status);

    response.send(dataFilter?.(path, data!) || data);
  });
