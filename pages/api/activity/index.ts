import { parseURLData } from 'web-utility';
import { DataObject } from 'mobx-restful';
import { TableCellValue, TableRecordList } from 'lark-ts-sdk';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import {
  LARK_BITABLE_ACTIVITY_ID,
  makeFilter,
  getBITableList,
} from '../../../models/Lark';

export type Activity = Record<
  | 'id'
  | 'name'
  | 'startTime'
  | 'endTime'
  | 'city'
  | 'location'
  | 'organizers'
  | 'link'
  | 'image',
  TableCellValue
>;

export default safeAPI(
  async (
    { method, url },
    response: NextApiResponse<TableRecordList<Activity>['data']>,
  ) => {
    switch (method) {
      case 'GET': {
        const { page_size, page_token, ...filter } = parseURLData(
          url!,
        ) as DataObject;

        const pageData = await getBITableList<Activity>({
          table: LARK_BITABLE_ACTIVITY_ID,
          page_size,
          page_token,
          filter: makeFilter(filter),
          sort: { startTime: 'DESC' },
        });
        response.json(pageData);
      }
    }
  },
);
