import { buildURLData, parseURLData } from 'web-utility';
import { TableRecordList } from 'lark-ts-sdk';
import { NextApiResponse } from 'next';

import { safeAPI } from './base';
import { lark } from './lark';
import { Organization } from '../../models/Organization';

const LARK_BITABLE_ID = process.env.LARK_BITABLE_ID!,
  LARK_BITABLE_TABLE_ID = process.env.LARK_BITABLE_TABLE_ID!;

export default safeAPI(
  async (
    request,
    response: NextApiResponse<TableRecordList<Organization>['data']>,
  ) => {
    switch (request.method) {
      case 'GET': {
        const biTable = await lark.getBITable(LARK_BITABLE_ID);

        const table = await biTable.getTable<Organization>(
          LARK_BITABLE_TABLE_ID,
        );
        const { body } = await lark.client.get<TableRecordList<Organization>>(
          `${table!.baseURI}/records?${buildURLData({
            ...parseURLData(request.url!),
            filter: `CurrentValue.[verified]="是"`,
          })}`,
        );
        response.json(body!.data);
      }
    }
  },
);
