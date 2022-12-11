import { Hour, cache, parseURLData } from 'web-utility';
import { DataObject } from 'mobx-restful';
import { TableRecordList } from 'lark-ts-sdk';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import { makeFilter, getBITableList } from '../../../models/Lark';
import { Member } from '../../../models/Member';

const LARK_BITABLE_MEMBERS_ID = process.env.LARK_BITABLE_MEMBERS_ID!;

const statistic = cache(async (clean, url: string) => {
  const { page_size, page_token, ...filter } = parseURLData(url) as DataObject;

  const pageData = await getBITableList<Member>({
    table: LARK_BITABLE_MEMBERS_ID,
    filter: makeFilter(filter),
  });
  setTimeout(clean, Hour / 2);

  return pageData;
}, 'members');

export type MembersStatic = TableRecordList<Member>['data'];

export default safeAPI(
  async ({ method, url }, response: NextApiResponse<MembersStatic>) => {
    switch (method) {
      case 'GET': {
        response.send(await statistic('' + url));
      }
    }
  },
);
