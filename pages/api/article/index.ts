import { parseURLData } from 'web-utility';
import { DataObject } from 'mobx-restful';
import { TableCellValue, TableRecordList } from 'lark-ts-sdk';
import { NextApiResponse } from 'next';

import { safeAPI } from '../base';
import { makeFilter, getBITableList } from '../../../models/Lark';
import {
  ARTICLE_LARK_BASE_ID,
  ARTICLE_LARK_TABLE_ID,
} from '../../../models/Article';

export type BaseArticle = Record<
  | 'id'
  | 'title'
  | 'author'
  | 'license'
  | 'type'
  | 'tags'
  | 'summary'
  | 'image'
  | 'publishedAt'
  | 'link'
  | 'alias',
  TableCellValue
>;

export default safeAPI(
  async (
    { method, url },
    response: NextApiResponse<TableRecordList<BaseArticle>['data']>,
  ) => {
    switch (method) {
      case 'GET': {
        const { page_size, page_token, ...filter } = parseURLData(
          url!,
        ) as DataObject;

        const pageData = await getBITableList<BaseArticle>({
          database: ARTICLE_LARK_BASE_ID,
          table: ARTICLE_LARK_TABLE_ID,
          page_size,
          page_token,
          filter: makeFilter(filter),
          sort: { publishedAt: 'DESC' },
        });
        response.json(pageData);
      }
    }
  },
);
