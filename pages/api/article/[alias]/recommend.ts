import type { NextApiResponse } from 'next';
import {
  ARTICLE_LARK_BASE_ID,
  ARTICLE_LARK_TABLE_ID,
  makeFilter,
  getBITableList,
} from '../../../../models/Lark';
import { safeAPI } from '../../base';
import { BaseArticle } from '../index';
import { getOneArticle } from './index';

export default safeAPI(
  async ({ method, query }, response: NextApiResponse<BaseArticle[]>) => {
    switch (method) {
      case 'GET': {
        const { alias } = query;

        const article = await getOneArticle(alias + '');

        if (!article) return response.status(404);

        const tags = (article.fields.tags + '').split(/\s+/);

        const { items } = await getBITableList<BaseArticle>({
          database: ARTICLE_LARK_BASE_ID,
          table: ARTICLE_LARK_TABLE_ID,
          filter: makeFilter({ tags }, 'OR'),
        });
        const list = items
          .map(
            ({ id, fields }) =>
              fields.alias !== alias && { ...fields, id: id! },
          )
          .filter(Boolean) as BaseArticle[];

        response.json(list);
      }
    }
  },
);
