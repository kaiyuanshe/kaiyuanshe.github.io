import { HTTPError } from 'koajax';
import {
  BiDataTable,
  LarkPageData,
  makeSimpleFilter,
  TableCellLink,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { Filter, NewData, toggle } from 'mobx-restful';
import { buildURLData, isEmpty } from 'web-utility';

import { blobClient, larkClient } from '../Base';

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

export class ArticleModel extends BiDataTable<Article>() {
  client = larkClient;

  constructor(appId = ARTICLE_BASE_ID, tableId = ARTICLE_TABLE_ID) {
    super(appId, tableId);
  }

  requiredKeys = ['title', 'image', 'publishedAt'] as const;

  sort = { publishedAt: 'DESC' } as const;

  currentRecommend?: ArticleModel;

  normalize({
    id,
    fields: { tags, link, ...fields },
  }: TableRecord<Omit<Article, 'content'>>): Article {
    return {
      ...fields,
      id,
      tags: (tags as string)?.trim().split(/\s+/),
      link: (link as TableCellLink)?.link,
    };
  }

  @toggle('downloading')
  async getOne(alias: string) {
    const { body } = await this.client.get<
      LarkPageData<TableRecord<BaseArticle>>
    >(
      `${this.baseURI}?${buildURLData({
        filter: makeSimpleFilter({ alias }, '='),
      })}`,
    );
    const [rawItem] = body!.data!.items || [];

    if (!rawItem)
      throw new HTTPError(`Article "${alias}" is not found`, {
        status: 404,
        statusText: 'Not found',
        headers: {},
      });
    const item = this.normalize(rawItem);

    const path = `article/${
      (item.link as string).split('/').slice(-1)[0]
    }.html`;

    const { body: raw } = await blobClient.get<ArrayBuffer>(path);

    const content = new TextDecoder().decode(raw);

    this.currentRecommend = new SearchArticleModel();

    await this.currentRecommend.getList({ tags: item.tags });

    return (this.currentOne = { ...item, content });
  }
}

export class SearchArticleModel extends ArticleModel {
  makeFilter(filter: NewData<Article>) {
    return isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');
  }
}

export default new ArticleModel();

export class CalendarSearchArticleModel extends ArticleModel {
  currentDate?: Date;

  async getMonthList(filter: Filter<Article>, date = new Date()) {
    this.currentDate = date;

    try {
      this.clearList();
      return await this.getAll(filter);
    } finally {
      this.currentDate = undefined;
    }
  }

  makeFilter({ ...filter }: NewData<Article>) {
    const [year, month] =
      this.currentDate?.toJSON().split('T')[0].split('-') || [];
    const nextMonth = (+month + 1 + '').padStart(2, '0');

    return [
      year && `CurrentValue.[publishedAt]>=TODATE("${year}-${month}-01")`,
      year && `CurrentValue.[publishedAt]<TODATE("${year}-${nextMonth}-01")`,
      !isEmpty(filter) && makeSimpleFilter(filter),
    ]
      .filter(Boolean)
      .join('&&');
  }
}
