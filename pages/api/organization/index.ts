import { buildURLData, parseURLData } from 'web-utility';
import { DataObject } from 'mobx-restful';
import { TableRecordList } from 'lark-ts-sdk';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import { lark, makeFilter } from '../../../models/Lark';
import { Organization } from '../../../models/Organization';

const LARK_BITABLE_ID = process.env.LARK_BITABLE_ID!,
  LARK_BITABLE_TABLE_ID = process.env.LARK_BITABLE_TABLE_ID!;

export default safeAPI(
  async (
    { method, url },
    response: NextApiResponse<TableRecordList<Organization>['data']>,
  ) => {
    switch (method) {
      case 'GET': {
        const biTable = await lark.getBITable(LARK_BITABLE_ID);

        const table = await biTable.getTable<Organization>(
            LARK_BITABLE_TABLE_ID,
          ),
          { page_size, page_token, ...filter } = parseURLData(
            url!,
          ) as DataObject;

        const { body } = await lark.client.get<TableRecordList<Organization>>(
          `${table!.baseURI}/records?${buildURLData({
            page_size,
            page_token,
            filter: makeFilter({ ...filter, verified: '是' }),
          })}`,
        );
        response.json(body!.data);
      }
    }
  },
);
