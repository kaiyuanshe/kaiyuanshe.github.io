import { TableCellLink, TableCellValue, TableRecordList } from 'lark-ts-sdk';
import { NewData, toggle } from 'mobx-restful';
import { buildURLData, isEmpty } from 'web-utility';

import { blobClient } from './Base';
import { BiTable, makeFilter, normalizeText } from './Lark';

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

export interface Article extends BaseArticle {
  content?: string;
}

export const ARTICLE_BASE_ID = process.env.NEXT_PUBLIC_ARTICLE_BASE_ID!;
export const ARTICLE_TABLE_ID = process.env.NEXT_PUBLIC_ARTICLE_TABLE_ID!;

export class ArticleModel extends BiTable<Article>() {
  constructor(appId = ARTICLE_BASE_ID, tableId = ARTICLE_TABLE_ID) {
    super(appId, tableId);
  }

  sort = { publishedAt: 'DESC' } as const;

  currentRecommend?: ArticleModel;

  @toggle('downloading')
  async getOne(alias: string) {
    const { body } = await this.client.get<TableRecordList<BaseArticle>>(
      `${this.baseURI}?${buildURLData({ filter: makeFilter({ alias }) })}`,
    );
    const item = this.normalize(body!.data.items[0]);

    const path = `article/${
      normalizeText(item.link as TableCellLink)
        .split('/')
        .slice(-1)[0]
    }.html`;

    const { body: raw } = await blobClient.get<ArrayBuffer>(path);

    const content = new TextDecoder().decode(raw);

    this.currentRecommend = new ArticleModel();

    await this.currentRecommend.getList({ tags: item.tags });

    return (this.currentOne = { ...item, content });
  }

  makeFilter(filter: NewData<Article>) {
    return isEmpty(filter)
      ? undefined
      : filter.tags
      ? makeFilter({ tags: (filter.tags + '').split(/\s+/) }, 'OR')
      : makeFilter(filter);
  }
}

export default new ArticleModel();
