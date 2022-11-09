import { parseURLData } from 'web-utility';
import { TableRecordList } from 'lark-ts-sdk';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import { getBITableList } from '../../../models/Lark';
import { Member } from '../../../models/Members';

const LARK_BITABLE_MEMBERS_ID = process.env.LARK_BITABLE_MEMBERS_ID!;

export default safeAPI(
  async (
    { method, url },
    response: NextApiResponse<TableRecordList<Member>['data']>,
  ) => {
    switch (method) {
      case 'GET': {
        const pageData = await getBITableList<Member>({
          table: LARK_BITABLE_MEMBERS_ID,
          filter: parseURLData(url!),
        });
        response.json(pageData);
      }
    }
  },
);
