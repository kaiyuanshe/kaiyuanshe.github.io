import { LarkData, LarkPageData, TableCellValue } from 'lark-ts-sdk';

import { lark } from '../../../models/Lark';
import { safeAPI } from '../base';

export type TableData = LarkPageData<{
  table_id: string;
  revision: number;
  name: string;
}>;

export type TableRecordData<T extends Record<string, TableCellValue>> =
  LarkData<{
    record: { id: string; record_id: string; fields: T };
  }>;

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
