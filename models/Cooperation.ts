import { computed, observable } from 'mobx';
import {
  BiDataTable,
  normalizeText,
  TableCellAttachment,
  TableCellLink,
  TableCellRelation,
  TableCellValue,
} from 'mobx-lark';
import { groupBy } from 'web-utility';

import { MAIN_BASE_ID } from '../pages/api/lark/core';
import { larkClient } from './Base';

export type Cooperation = Record<
  'id' | 'organization' | 'year' | 'level' | 'link' | 'logos',
  TableCellValue
>;

export const COOPERATION_TABLE_ID =
  process.env.NEXT_PUBLIC_COOPERATION_TABLE_ID!;

export class CooperationModel extends BiDataTable<Cooperation>() {
  client = larkClient;

  constructor(appId = MAIN_BASE_ID, tableId = COOPERATION_TABLE_ID) {
    super(appId, tableId);
  }

  requiredKeys = ['organization', 'year', 'level', 'logos'] as const;

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
          link: (link as TableCellLink[])?.map(({ link }) => link),
          logos: (logos as TableCellAttachment[])?.map(
            ({ attachmentToken, ...logo }) => ({
              ...logo,
              file_token: attachmentToken,
            }),
          ) as any[],
        })),
      ]),
    );
    return (this.group = group);
  }
}
