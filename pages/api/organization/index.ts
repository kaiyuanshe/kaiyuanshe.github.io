import { parseURLData } from 'web-utility';
import { TableRecordList } from 'lark-ts-sdk';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import { getBITableList } from '../../../models/Lark';
import { Organization } from '../../../models/Organization';

const LARK_BITABLE_ORGANIZATION_ID = process.env.LARK_BITABLE_ORGANIZATION_ID!;

export default safeAPI(
  async (
    { method, url },
    response: NextApiResponse<TableRecordList<Organization>['data']>,
  ) => {
    switch (method) {
      case 'GET': {
        const pageData = await getBITableList<Organization>({
          table: LARK_BITABLE_ORGANIZATION_ID,
          filter: { ...parseURLData(url!), verified: '是' },
        });
        response.json(pageData);
      }
    }
  },
);
