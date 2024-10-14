import { observable } from 'mobx';
import {
  BiDataQueryOptions,
  BiDataTable,
  makeSimpleFilter,
  TableCellLink,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { Filter, NewData } from 'mobx-restful';
import { cache, countBy, groupBy, Hour, isEmpty } from 'web-utility';

import { larkClient, Search } from '../Base';
import { COMMUNITY_BASE_ID } from './index';

export type Organization = Record<
  | 'id'
  | 'verified'
  | 'name'
  | 'type'
  | 'tags'
  | 'startDate'
  | 'city'
  | 'email'
  | 'link'
  | 'codeLink'
  | 'wechatName'
  | 'logos'
  | 'summary',
  TableCellValue
>;

export type OrganizationStatistic = Record<
  'type' | 'tag' | 'year' | 'city',
  Record<string, number>
>;

export const ORGANIZATION_TABLE_ID =
    process.env.NEXT_PUBLIC_ORGANIZATION_TABLE_ID!,
  NGO_BASE_ID = process.env.NEXT_PUBLIC_NGO_BASE_ID!,
  NGO_TABLE_ID = process.env.NEXT_PUBLIC_NGO_TABLE_ID!;

export const sortStatistic = (data: Record<string, number>, sortValue = true) =>
  Object.entries(data)
    .map(([key, count]) => [key, count] as const)
    .sort(([kX, vX], [kY, vY]) => (sortValue ? vY - vX : kY.localeCompare(kX)));

export class OrganizationModel extends BiDataTable<Organization>() {
  client = larkClient;

  constructor(appId = COMMUNITY_BASE_ID, tableId = ORGANIZATION_TABLE_ID) {
    super(appId, tableId);
  }

  requiredKeys = ['name', 'type', 'tags', 'city', 'logos', 'summary'] as const;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  declare statistic: OrganizationStatistic;

  @observable
  accessor tagMap: Record<string, Organization[]> = {};

  normalize({
    id,
    fields: { link, codeLink, ...fields },
  }: TableRecord<Organization>) {
    return {
      ...fields,
      id: id!,
      link: (link as TableCellLink)?.link,
      codeLink: (codeLink as TableCellLink)?.link,
    };
  }

  makeFilter(filter: NewData<Organization>) {
    return [
      'CurrentValue.[verified]=1',
      !isEmpty(filter) && makeSimpleFilter(filter),
    ]
      .filter(Boolean)
      .join('&&');
  }

  getStatistic = cache(async clean => {
    const list = await this.getAll();

    setTimeout(clean, Hour / 2);

    return (this.statistic = {
      type: countBy(list, 'type'),
      tag: countBy(list, 'tags'),
      year: countBy(list, ({ startDate }) =>
        new Date(startDate as number).getFullYear(),
      ),
      city: countBy(list, 'city'),
    });
  }, 'Organization Statistic');

  async groupAllByTags() {
    await this.getAll();

    return (this.tagMap = groupBy(
      this.allItems,
      ({ tags }) => tags as string[],
    ));
  }
}

export class SearchOrganizationModel extends Search(OrganizationModel) {
  searchKeys = [
    'name',
    'summary',
    'city',
    'email',
    'link',
    'codeLink',
    'wechatName',
  ] as const;

  makeFilter(filter: Filter<Organization>) {
    return ['CurrentValue.[verified]=1', super.makeFilter(filter)]
      .filter(Boolean)
      .join('&&');
  }
}

export class SearchNGOModel extends SearchOrganizationModel {
  constructor(appId = NGO_BASE_ID, tableId = NGO_TABLE_ID) {
    super(appId, tableId);
  }
}

export default new OrganizationModel();
