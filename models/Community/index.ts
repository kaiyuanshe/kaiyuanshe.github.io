import { makeObservable, observable } from 'mobx';
import {
  BiDataTable,
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
  | 'Person'
  | 'logo'
  | 'director'
  | 'startDate'
  | 'summary'
  | 'link'
  | 'Activity',
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
    fields: { link, director, Person, Activity, ...fields },
  }: TableRecord<Community>) {
    return {
      ...fields,
      id: id!,
      link: (link as TableCellLink)?.link,
      director: (director as TableCellRelation[])?.map(normalizeText)[0],
      Person: (Person as TableCellRelation[])?.map(normalizeText)[0],
      Activity: (Activity as TableCellRelation[])?.map(normalizeText)[0],
    };
  }
}
