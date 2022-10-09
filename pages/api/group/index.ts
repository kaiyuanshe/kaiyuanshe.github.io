import { buildURLData, parseURLData } from 'web-utility';
import { DataObject } from 'mobx-restful';
import { TableRecordList } from 'lark-ts-sdk';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import { lark, makeFilter } from '../../../models/Lark';
import { Group } from '../../../models/Group';

const LARK_BITABLE_ID = process.env.LARK_BITABLE_ID!,
  LARK_BITABLE_GROUP_ID = process.env.LARK_BITABLE_GROUP_ID!;

export default safeAPI(
  async (
    { method, url },
    response: NextApiResponse<TableRecordList<Group>['data']>,
  ) => {
    switch (method) {
      case 'GET': {
        const biTable = await lark.getBITable(LARK_BITABLE_ID);

        const table = await biTable.getTable<Group>(LARK_BITABLE_GROUP_ID),
          { page_size, page_token, ...filter } = parseURLData(
            url!,
          ) as DataObject;

        const { body } = await lark.client.get<TableRecordList<Group>>(
          `${table!.baseURI}/records?${buildURLData({
            page_size,
            page_token,
            filter: makeFilter(filter),
          })}`,
        );
        response.json(body!.data);
      }
    }
  },
);
