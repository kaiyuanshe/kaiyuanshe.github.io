import { HTTPError } from 'koajax';
import {
  BiDataQueryOptions,
  BiDataTable,
  BiSearch,
  LarkPageData,
  makeSimpleFilter,
  TableCellLink,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { Filter, NewData, toggle } from 'mobx-restful';
import { buildURLData, isEmpty } from 'web-utility';

import { blobClient, larkClient } from '../Base';

export type Article = Record<
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
  | 'alias'
  | 'content',
  TableCellValue
>;

export const ARTICLE_BASE_ID = process.env.NEXT_PUBLIC_ARTICLE_BASE_ID!;
export const ARTICLE_TABLE_ID = process.env.NEXT_PUBLIC_ARTICLE_TABLE_ID!;

export class ArticleModel extends BiDataTable<Article>() {
  client = larkClient;

  constructor(appId = ARTICLE_BASE_ID, tableId = ARTICLE_TABLE_ID) {
    super(appId, tableId);
  }

  requiredKeys = ['title', 'image', 'publishedAt'] as const;

  sort = { publishedAt: 'DESC' } as const;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  currentRecommend?: SearchArticleModel;

  normalize({ id, fields: { tags, link, ...fields } }: TableRecord<Article>) {
    return {
      ...fields,
      id,
      tags: (tags as string)?.trim().split(/\s+/),
      link: (link as TableCellLink)?.link,
    };
  }

  @toggle('downloading')
  async getOne(alias: string) {
    const path = `${this.baseURI}?${buildURLData({
      filter: makeSimpleFilter({ alias }, '='),
    })}`;
    const { body } =
      await this.client.get<LarkPageData<TableRecord<Article>>>(path);
    const [rawItem] = body!.data!.items || [];

    if (!rawItem)
      throw new HTTPError(
        `Article "${alias}" is not found`,
        { method: 'GET', path },
        { status: 404, statusText: 'Not found', headers: {} },
      );
    const item = this.normalize(rawItem);

    const filePath = `article/${
      (item.link as string).split('/').slice(-1)[0]
    }.html`;

    const { body: raw } = await blobClient.get<ArrayBuffer>(filePath);

    const content = new TextDecoder().decode(raw);

    this.currentRecommend = new SearchArticleModel();

    await this.currentRecommend.getList({ tags: item.tags });

    return (this.currentOne = { ...item, content });
  }
}

export class SearchArticleModel extends BiSearch<Article>(ArticleModel) {
  searchKeys = ['title', 'author', 'license', 'summary'] as const;
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
