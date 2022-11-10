import { parseURLData } from 'web-utility';
import { DataObject } from 'mobx-restful';
import { TableRecordList } from 'lark-ts-sdk';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import { makeFilter, getBITableList } from '../../../models/Lark';
import { Member } from '../../../models/Member';

const LARK_BITABLE_MEMBERS_ID = process.env.LARK_BITABLE_MEMBERS_ID!;

export default safeAPI(
  async (
    { method, url },
    response: NextApiResponse<TableRecordList<Member>['data']>,
  ) => {
    switch (method) {
      case 'GET': {
        const { page_size, page_token, ...filter } = parseURLData(
          url!,
        ) as DataObject;

        const pageData = await getBITableList<Member>({
          table: LARK_BITABLE_MEMBERS_ID,
          filter: makeFilter(filter),
        });
        response.json(pageData);
      }
    }
  },
);
