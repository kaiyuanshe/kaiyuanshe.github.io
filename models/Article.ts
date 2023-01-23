import { isEmpty, buildURLData } from 'web-utility';
import { NewData, ListModel, Stream, toggle } from 'mobx-restful';
import { TableCellLink, TableRecordList } from 'lark-ts-sdk';

import { blobClient, client } from './Base';
import { makeFilter, normalizeText } from './Lark';
import { BaseArticle } from '../pages/api/article';

export interface Article extends BaseArticle {
  content?: string;
}

export const ARTICLE_LARK_BASE_ID = process.env.NEXT_PUBLIC_ARTICLE_BASE_ID!;
export const ARTICLE_LARK_TABLE_ID = process.env.NEXT_PUBLIC_ARTICLE_TABLE_ID!;

export class ArticleModel extends Stream<Article>(ListModel) {
  client = client;
  baseURI = `lark/bitable/v1/apps/${ARTICLE_LARK_BASE_ID}/tables/${ARTICLE_LARK_TABLE_ID}/records`;

  currentRecommend?: ArticleModel;

  normalize({
    id,
    fields,
  }: TableRecordList<BaseArticle>['data']['items'][number]) {
    return { ...fields, id: id! };
  }

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

  async *openStream(filter: NewData<BaseArticle>) {
    var lastPage = '';

    do {
      const { body } = await this.client.get<TableRecordList<BaseArticle>>(
        `${this.baseURI}?${buildURLData({
          page_size: 100,
          page_token: lastPage,
          filter: isEmpty(filter)
            ? undefined
            : filter.tags
            ? makeFilter({ tags: (filter.tags + '').split(/\s+/) }, 'OR')
            : makeFilter(filter),
          sort: JSON.stringify(['publishedAt DESC']),
        })}`,
      );
      var { items, total, has_more, page_token } = body!.data;

      lastPage = page_token;
      this.totalCount = total;

      yield* items.map(item => this.normalize(item));
    } while (has_more);
  }
}

export default new ArticleModel();
