import { Hour, IndexKey, Iteratee, groupBy, cache } from 'web-utility';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import { lark } from '../../../models/Lark';
import { Organization } from '../../../models/Organization';

const LARK_BITABLE_ID = process.env.LARK_BITABLE_ID!,
  LARK_BITABLE_ORGANIZATION_ID = process.env.LARK_BITABLE_ORGANIZATION_ID!;

function statisticBy<T extends Record<IndexKey, any>>(
  list: T[],
  iteratee: Iteratee<T>,
) {
  const group = groupBy(list, iteratee);

  const sortedList = Object.entries(group).map(
    ([key, { length }]) => [key, length] as const,
  );
  return Object.fromEntries(sortedList);
}

export const sortStatistic = (data: Record<string, number>, sortValue = true) =>
  Object.entries(data)
    .map(([key, count]) => [key, count] as const)
    .sort(([kX, vX], [kY, vY]) => (sortValue ? vY - vX : kY.localeCompare(kX)));

const statistic = cache(async clean => {
  const biTable = await lark.getBITable(LARK_BITABLE_ID);

  const table = await biTable.getTable<Organization>(
    LARK_BITABLE_ORGANIZATION_ID,
  );
  const list = ((await table?.getAllRecords()) || []).filter(
    ({ verified }) => verified === '是',
  );
  const type = statisticBy(list, 'type'),
    tag = statisticBy(list, 'tags'),
    year = statisticBy(list, ({ startDate }) =>
      new Date(startDate as number).getFullYear(),
    ),
    city = statisticBy(list, ({ city }) => (city + '').trim().split(/\s+/));

  setTimeout(clean, Hour / 2);

  return { type, tag, year, city };
}, 'Organization statistic');

export type OrganizationStatistic = Record<
  'type' | 'tag' | 'year' | 'city',
  Record<string, number>
>;

export default safeAPI(
  async ({ method }, response: NextApiResponse<OrganizationStatistic>) => {
    switch (method) {
      case 'GET':
        response.send(await statistic());
    }
  },
);
