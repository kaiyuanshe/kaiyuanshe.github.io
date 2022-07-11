import { TableCellValue } from 'lark-ts-sdk';
import { NextApiResponse } from 'next';

import { safeAPI } from './base';
import { lark } from './lark';

const LARK_BITABLE_ID = process.env.LARK_BITABLE_ID!,
  LARK_BITABLE_TABLE_ID = process.env.LARK_BITABLE_TABLE_ID!;

export type Organization = Record<
  | 'id'
  | 'verified'
  | 'name'
  | 'type'
  | 'tags'
  | 'startDate'
  | 'city'
  | 'email'
  | 'link'
  | 'codeLink'
  | 'wechatName'
  | 'logos'
  | 'summary',
  TableCellValue
>;

export default safeAPI(
  async (request, response: NextApiResponse<Organization[]>) => {
    switch (request.method) {
      case 'GET': {
        const biTable = await lark.getBITable(LARK_BITABLE_ID);

        const table = await biTable.getTable<Organization>(
          LARK_BITABLE_TABLE_ID,
        );
        const data = await table?.getAllRecords();

        const list = data?.filter(({ verified }) => verified) || [];

        response.json(list);
      }
    }
  },
);
