import {
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecordList,
} from 'lark-ts-sdk';
import { computed, observable } from 'mobx';
import { NewData } from 'mobx-restful';
import { cache, countBy, groupBy, Hour } from 'web-utility';

import { BiTable, MAIN_BASE_ID, makeFilter, normalizeText } from './Lark';

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

export type Cooperation = Record<
  'organization' | 'year' | 'level' | 'link' | 'logos',
  TableCellValue
>;

export const ORGANIZATION_TABLE_ID =
  process.env.NEXT_PUBLIC_ORGANIZATION_TABLE_ID!;

export const sortStatistic = (data: Record<string, number>, sortValue = true) =>
  Object.entries(data)
    .map(([key, count]) => [key, count] as const)
    .sort(([kX, vX], [kY, vY]) => (sortValue ? vY - vX : kY.localeCompare(kX)));

export class OrganizationModel extends BiTable<Organization>() {
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
    return makeFilter({ ...filter, verified: '是' });
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

export const COOPERATION_TABLE_ID =
  process.env.NEXT_PUBLIC_COOPERATION_TABLE_ID!;

export class CooperationModel extends BiTable<Cooperation>() {
  constructor(appId = MAIN_BASE_ID, tableId = COOPERATION_TABLE_ID) {
    super(appId, tableId);
  }

  @observable
  group: Record<string, Cooperation[]> = {};

  @computed
  get yearGroup() {
    const { group } = this;

    return Object.entries(group)
      .sort(([x], [y]) => +y - +x)
      .map(([year, list]) => [+year, groupBy(list, 'level')]) as [
      number,
      Record<string, Cooperation[]>,
    ][];
  }

  async getGroup() {
    var group = groupBy(await this.getAll(), ({ year }) => year + '');

    group = Object.fromEntries(
      Object.entries(group).map(([year, list]) => [
        year,
        list.map(({ organization, link, logos, ...item }) => ({
          ...item,
          organization: (organization as TableCellRelation[]).map(
            normalizeText,
          ),
          link: (link as TableCellLink[])?.map(normalizeText),
          logos: (logos as any[])?.map(({ attachmentToken, ...logo }) => ({
            ...logo,
            file_token: attachmentToken,
          })),
        })),
      ]),
    );
    return (this.group = group);
  }
}

export default new OrganizationModel();
