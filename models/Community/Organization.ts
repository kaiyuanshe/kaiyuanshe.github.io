import { observable } from 'mobx';
import {
  BiDataQueryOptions,
  BiDataTable,
  BiSearch,
  makeSimpleFilter,
  normalizeText,
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { Filter, NewData } from 'mobx-restful';
import { groupBy, isEmpty } from 'web-utility';

import { larkClient } from '../Base';
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

  @observable
  accessor tagMap: Record<string, Organization[]> = {};

  normalize({
    fields: { type, tags, link, codeLink, ...fields },
    ...meta
  }: TableRecord<Organization>) {
    return {
      ...meta,
      ...fields,
      type: (type as TableCellRelation[])?.map(normalizeText),
      tags: (tags as TableCellRelation[])
        ?.map(normalizeText)
        .toString()
        .split(','),
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

  async groupAllByTags() {
    await this.getAll();

    return (this.tagMap = groupBy(
      this.allItems,
      ({ tags }) => tags as string[],
    ));
  }
}

export type OrganizationStatisticItem = Record<
  'name' | `${'organization' | 'activity'}Count`,
  TableCellValue
>;

export const OSC_YEAR_STATISTIC_TABLE_ID =
    process.env.NEXT_PUBLIC_OSC_YEAR_STATISTIC_TABLE_ID!,
  OSC_CITY_STATISTIC_TABLE_ID =
    process.env.NEXT_PUBLIC_OSC_CITY_STATISTIC_TABLE_ID!,
  OSC_TYPE_STATISTIC_TABLE_ID =
    process.env.NEXT_PUBLIC_OSC_TYPE_STATISTIC_TABLE_ID!,
  OSC_TAG_STATISTIC_TABLE_ID =
    process.env.NEXT_PUBLIC_OSC_TAG_STATISTIC_TABLE_ID!;
export const NGO_YEAR_STATISTIC_TABLE_ID =
    process.env.NEXT_PUBLIC_NGO_YEAR_STATISTIC_TABLE_ID!,
  NGO_CITY_STATISTIC_TABLE_ID =
    process.env.NEXT_PUBLIC_NGO_CITY_STATISTIC_TABLE_ID!,
  NGO_TYPE_STATISTIC_TABLE_ID =
    process.env.NEXT_PUBLIC_NGO_TYPE_STATISTIC_TABLE_ID!,
  NGO_TAG_STATISTIC_TABLE_ID =
    process.env.NEXT_PUBLIC_NGO_TAG_STATISTIC_TABLE_ID!;

export class OrganizationStatisticModel extends BiDataTable<OrganizationStatisticItem>() {
  client = larkClient;

  requiredKeys = ['name'] as const;

  queryOptions = { text_field_as_array: false };

  countAll = async ([
    key = 'organizationCount',
  ]: (keyof OrganizationStatisticItem)[] = []) => {
    const list = await this.getAll();
    const group = list
      .map(({ name, [key]: count }) => count && [name, count])
      .filter(Boolean) as [string, number][];

    return Object.fromEntries(group);
  };
}

export class SearchOrganizationModel extends BiSearch(OrganizationModel) {
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
