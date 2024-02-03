import { computed, observable } from 'mobx';
import {
  BiDataQueryOptions,
  BiDataTable,
  normalizeText,
  TableCellAttachment,
  TableCellLink,
  TableCellMedia,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { groupBy } from 'web-utility';

import { MAIN_BASE_ID } from '../../pages/api/lark/core';
import { larkClient } from '../Base';

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

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  @observable
  accessor group: Record<string, Cooperation[]> = {};

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

  normalize({
    id,
    fields: { organization, link, logos, ...fields },
  }: TableRecord<Cooperation>): Cooperation {
    return {
      ...fields,
      id: id!,
      organization: (organization as TableCellRelation[]).map(normalizeText),
      link: (link as TableCellLink[])?.map(({ link }) => link),
      logos: (logos as TableCellAttachment[])?.map(
        ({ attachmentToken, ...logo }) => ({
          ...logo,
          file_token: attachmentToken,
        }),
      ) as unknown as TableCellMedia[],
    };
  }

  async getGroup() {
    return (this.group = groupBy(await this.getAll(), ({ year }) => year + ''));
  }
}
