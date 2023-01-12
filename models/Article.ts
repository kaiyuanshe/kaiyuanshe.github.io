import { observable } from 'mobx';
import { NewData, ListModel, Stream, toggle } from 'mobx-restful';
import { TableCellValue } from 'lark-ts-sdk';

import { client } from './Base';
import { createListStream } from './Lark';
import { BaseArticle } from '../pages/api/article';

export interface Article extends BaseArticle {
  content: string;
}

export class ArticleModel extends Stream<Article>(ListModel) {
  client = client;
  baseURI = 'article';

  @observable
  currentRecommend: Article[] = [];

  normalize = ({
    id,
    fields,
  }: {
    id?: TableCellValue;
    fields: Article;
  }): Article => ({
    ...fields,
    id: id!,
  });

  async *openStream(filter: NewData<Article>) {
    for await (const { total, items } of createListStream<Article>(
      this.client,
      this.baseURI,
      filter,
    )) {
      this.totalCount = total;

      yield* items?.map(this.normalize) || [];
    }
  }

  @toggle('downloading')
  async getRecommendList(alias: string) {
    const { body } = await this.client.get<Article[]>(
      `${this.baseURI}/${alias}/recommend`,
    );
    return (this.currentRecommend = body!);
  }
}

export default new ArticleModel();
