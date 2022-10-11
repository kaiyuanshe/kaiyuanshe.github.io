import { parseURLData } from 'web-utility';
import { TableRecordList } from 'lark-ts-sdk';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import { getBITableList } from '../../../models/Lark';
import { Group } from '../../../models/Group';

const LARK_BITABLE_GROUP_ID = process.env.LARK_BITABLE_GROUP_ID!;

export default safeAPI(
  async (
    { method, url },
    response: NextApiResponse<TableRecordList<Group>['data']>,
  ) => {
    switch (method) {
      case 'GET': {
        const pageData = await getBITableList<Group>({
          table: LARK_BITABLE_GROUP_ID,
          filter: parseURLData(url!),
        });
        response.json(pageData);
      }
    }
  },
);
