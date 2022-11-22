import { parseURLData } from 'web-utility';
import { DataObject } from 'mobx-restful';
import { TableRecordList } from 'lark-ts-sdk';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import {
  LARK_BITABLE_GROUP_ID,
  makeFilter,
  getBITableList,
} from '../../../models/Lark';
import { Group } from '../../../models/Group';

export default safeAPI(
  async (
    { method, url },
    response: NextApiResponse<TableRecordList<Group>['data']>,
  ) => {
    switch (method) {
      case 'GET': {
        const { page_size, page_token, ...filter } = parseURLData(
          url!,
        ) as DataObject;

        const pageData = await getBITableList<Group>({
          table: LARK_BITABLE_GROUP_ID,
          page_size,
          page_token,
          filter: makeFilter(filter),
        });
        response.json(pageData);
      }
    }
  },
);
