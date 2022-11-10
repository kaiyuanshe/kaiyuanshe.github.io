import { basename } from 'path';
import { NextApiResponse } from 'next';
import { TableCellLink } from 'lark-ts-sdk';

import { safeAPI } from '../../base';
import { blobClient } from '../../../../models/Base';
import {
  ARTICLE_LARK_BASE_ID,
  ARTICLE_LARK_TABLE_ID,
  makeFilter,
  getBITableList,
  normalizeText,
} from '../../../../models/Lark';
import { Article } from '../../../../models/Article';
import { BaseArticle } from '../index';

export async function getOneArticle(alias: string) {
  const { items } = await getBITableList<BaseArticle>({
    database: ARTICLE_LARK_BASE_ID,
    table: ARTICLE_LARK_TABLE_ID,
    filter: makeFilter({ alias }),
  });
  return items.find(({ fields }) => fields.alias === alias);
}

export default safeAPI(
  async ({ method, query }, response: NextApiResponse<Article>) => {
    switch (method) {
      case 'GET': {
        const article = await getOneArticle(query.alias + '');

        if (!article) return response.status(404);

        const { id, fields } = article;

        const path = `article/${basename(
          normalizeText(fields.link as TableCellLink),
        )}.html`;

        const { body } = await blobClient.get<ArrayBuffer>(path);

        response.json({
          ...fields,
          id: id!,
          content: new TextDecoder().decode(body),
        });
      }
    }
  },
);
