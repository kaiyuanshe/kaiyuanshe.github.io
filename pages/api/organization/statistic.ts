import { Hour, cache, groupBy } from 'web-utility';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import { lark } from '../../../models/Lark';
import { Organization } from '../../../models/Organization';

const LARK_BITABLE_ID = process.env.LARK_BITABLE_ID!,
  LARK_BITABLE_ORGANIZATION_ID = process.env.LARK_BITABLE_ORGANIZATION_ID!;

const statistic = cache(async clean => {
  const biTable = await lark.getBITable(LARK_BITABLE_ID);

  const table = await biTable.getTable<Organization>(
    LARK_BITABLE_ORGANIZATION_ID,
  );

  const list = ((await table?.getAllRecords()) || []).filter(
    ({ verified }) => verified === '是',
  );
  const city = Object.fromEntries(
    Object.entries(
      groupBy(list, ({ city }) => (city + '').trim().split(/\s+/)),
    ).map(([city, { length }]) => [city, length]),
  );
  setTimeout(clean, Hour / 2);

  return { city };
}, 'Organization statistic');

export interface OrganizationStatistic {
  city: Record<string, number>;
}

export default safeAPI(
  async ({ method }, response: NextApiResponse<OrganizationStatistic>) => {
    switch (method) {
      case 'GET':
        response.send(await statistic());
    }
  },
);
