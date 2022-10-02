import { NextApiResponse } from 'next';
import { parseURLData, buildURLData } from 'web-utility';
import { DataObject } from 'mobx-restful';
import { TableRecordList } from 'lark-ts-sdk';

import { safeAPI } from '../base';
import { lark } from '../../../models/Lark';
import { Cooperation } from '../../../models/Organization';

const LARK_BITABLE_ID = process.env.LARK_BITABLE_ID!;

export default safeAPI(
  async (
    { method, url },
    response: NextApiResponse<TableRecordList<Cooperation>['data']>,
  ) => {
    switch (method) {
      case 'GET': {
        const biTable = await lark.getBITable(LARK_BITABLE_ID);

        const table = await biTable.getTable<{}>('tbldaVidMHzV9Vo2'),
          { page_size, page_token } = parseURLData(url!) as DataObject;

        const { body } = await lark.client.get<TableRecordList<Cooperation>>(
          `${table!.baseURI}/records?${buildURLData({
            page_size,
            page_token,
          })}`,
        );
        response.json(body!.data);
      }
    }
  },
);
