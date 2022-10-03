import { groupBy } from 'web-utility';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import { lark } from '../../../models/Lark';
import { Cooperation } from '../../../models/Organization';

const LARK_BITABLE_ID = process.env.LARK_BITABLE_ID!,
  LARK_BITABLE_COOPERATION_ID = process.env.LARK_BITABLE_COOPERATION_ID!;

export type CooperationData = Record<number, Cooperation[]>;

export default safeAPI(
  async ({ method }, response: NextApiResponse<CooperationData>) => {
    switch (method) {
      case 'GET': {
        const biTable = await lark.getBITable(LARK_BITABLE_ID);

        const table = await biTable.getTable<Cooperation>(
          LARK_BITABLE_COOPERATION_ID,
        );
        const list = await table!.getAllRecords();

        response.json(groupBy(list, 'year'));
      }
    }
  },
);
