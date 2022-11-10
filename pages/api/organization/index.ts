import { parseURLData } from 'web-utility';
import { DataObject } from 'mobx-restful';
import { TableRecordList } from 'lark-ts-sdk';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import {
  LARK_BITABLE_ORGANIZATION_ID,
  makeFilter,
  getBITableList,
} from '../../../models/Lark';
import { Organization } from '../../../models/Organization';

export default safeAPI(
  async (
    { method, url },
    response: NextApiResponse<TableRecordList<Organization>['data']>,
  ) => {
    switch (method) {
      case 'GET': {
        const { page_size, page_token, ...filter } = parseURLData(
          url!,
        ) as DataObject;

        const pageData = await getBITableList<Organization>({
          table: LARK_BITABLE_ORGANIZATION_ID,
          page_size,
          page_token,
          filter: makeFilter({ ...filter, verified: '是' }),
        });
        response.json(pageData);
      }
    }
  },
);
