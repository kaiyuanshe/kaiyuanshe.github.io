import { observable } from 'mobx';
import {
  BiDataTable,
  makeSimpleFilter,
  normalizeText,
  TableCellLink,
  TableCellValue,
  TableRecordList,
} from 'mobx-lark';
import { NewData } from 'mobx-restful';
import { cache, countBy, groupBy, Hour, isEmpty } from 'web-utility';

import { MAIN_BASE_ID } from '../pages/api/lark/core';
import { larkClient } from './Base';

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
  process.env.NEXT_PUBLIC_ORGANIZATION_TABLE_ID!;

export const sortStatistic = (data: Record<string, number>, sortValue = true) =>
  Object.entries(data)
    .map(([key, count]) => [key, count] as const)
    .sort(([kX, vX], [kY, vY]) => (sortValue ? vY - vX : kY.localeCompare(kX)));

export class OrganizationModel extends BiDataTable<Organization>() {
  client = larkClient;

  constructor(appId = MAIN_BASE_ID, tableId = ORGANIZATION_TABLE_ID) {
    super(appId, tableId);
  }

  @observable
  statistic: OrganizationStatistic = {} as OrganizationStatistic;

  @observable
  tagMap: Record<string, Organization[]> = {};

  normalize({
    id,
    fields: { link, codeLink, email, ...fields },
  }: TableRecordList<Organization>['data']['items'][number]) {
    return {
      ...fields,
      id: id!,
      link: normalizeText(link as TableCellLink),
      codeLink: normalizeText(codeLink as TableCellLink),
      email: normalizeText(email as TableCellLink),
    };
  }

  makeFilter(filter: NewData<Organization>) {
    return makeSimpleFilter({ ...filter, verified: '是' });
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

export class SearchOrganizationModel extends OrganizationModel {
  makeFilter(filter: NewData<Organization>) {
    return [
      'CurrentValue.[verified]="是"',
      isEmpty(filter) ? undefined : makeSimpleFilter(filter, 'contains', 'OR'),
    ]
      .filter(Boolean)
      .join('&&');
  }
}

export default new OrganizationModel();
