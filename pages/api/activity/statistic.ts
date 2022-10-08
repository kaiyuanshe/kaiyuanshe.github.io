import { countBy, cache } from 'web-utility';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import { lark } from '../../../models/Lark';
import { Activity } from '../../../models/Activity';

const LARK_BITABLE_ID = process.env.LARK_BITABLE_ID!,
  LARK_BITABLE_ACTIVITY_ID = process.env.LARK_BITABLE_ACTIVITY_ID!;

const statistic = cache(async () => {
  const biTable = await lark.getBITable(LARK_BITABLE_ID);

  const table = await biTable.getTable<Activity>(LARK_BITABLE_ACTIVITY_ID);

  const list = await table!.getAllRecords();

  return { city: countBy(list, 'city') };
}, 'Activity Statistic');

export type ActivityStatistic = Record<'city', Record<string, number>>;

export default safeAPI(
  async ({ method }, response: NextApiResponse<ActivityStatistic>) => {
    switch (method) {
      case 'GET': {
        response.send(await statistic());
      }
    }
  },
);
