import { observable } from 'mobx';
import {
  BiDataQueryOptions,
  BiDataTable,
  BiSearch,
  normalizeText,
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { larkClient } from '../Base';

export type Community = Record<
  | 'id'
  | 'name'
  | 'logo'
  | 'director'
  | 'startDate'
  | 'summary'
  | 'link'
  | 'approver',
  TableCellValue
>;

export const KCC_BASE_ID = process.env.NEXT_PUBLIC_KCC_BASE_ID!,
  COMMUNITY_BASE_ID = process.env.NEXT_PUBLIC_COMMUNITY_BASE_ID!,
  COMMUNITY_TABLE_ID = process.env.NEXT_PUBLIC_COMMUNITY_TABLE_ID!;

export class CommunityModel extends BiDataTable<Community>() {
  client = larkClient;

  constructor(appId = KCC_BASE_ID, tableId = COMMUNITY_TABLE_ID) {
    super(appId, tableId);
  }

  requiredKeys = ['name', 'approver'] as const;

  sort = { name: 'ASC' } as const;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  @observable
  accessor group: Record<string, Community[]> = {};

  normalize({
    id,
    fields: { link, director, approver, ...fields },
  }: TableRecord<Community>) {
    return {
      ...fields,
      id: id!,
      link: (link as TableCellLink)?.link,
      director: (director as TableCellRelation[])?.map(normalizeText)[0],
      approver: (approver as TableCellRelation[])?.map(normalizeText)[0],
    };
  }
}

export class SearchCommunityModel extends BiSearch<Community>(CommunityModel) {
  searchKeys = ['name', 'director', 'summary'] as const;
}
