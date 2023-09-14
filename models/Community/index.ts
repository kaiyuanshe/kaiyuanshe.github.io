import { makeObservable, observable } from 'mobx';
import {
  BiDataTable,
  makeSimpleFilter,
  normalizeText,
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { NewData } from 'mobx-restful';
import { cache, countBy, groupBy, Hour, isEmpty } from 'web-utility';

import { larkClient } from '../Base';

export type Community = Record<
  'id' | 'name' | 'logo' | 'director' | 'startDate' | 'summary' | 'link',
  TableCellValue
>;

export const KCC_BASE_ID = process.env.NEXT_PUBLIC_KCC_BASE_ID!;
export const COMMUNITY_TABLE_ID = process.env.NEXT_PUBLIC_COMMUNITY_TABLE_ID!;

export class CommunityModel extends BiDataTable<Community>() {
  client = larkClient;

  constructor(appId = KCC_BASE_ID, tableId = COMMUNITY_TABLE_ID) {
    super(appId, tableId);

    makeObservable(this);
  }

  requiredKeys = ['name'] as const;

  sort = { name: 'ASC' } as const;

  @observable
  group: Record<string, Community[]> = {};

  normalize({
    id,
    fields: { link, director, ...fields },
  }: TableRecord<Community>) {
    return {
      ...fields,
      id: id!,
      link: (link as TableCellLink)?.link,
      director: (director as TableCellRelation[])?.map(normalizeText)[0],
    };
  }
}

export class SearchCommunityModel extends CommunityModel {
  makeFilter(filter: NewData<Community>) {
    return isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');
  }
}
