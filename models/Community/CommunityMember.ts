import { makeObservable, observable } from 'mobx';
import {
  BiDataTable,
  TableCellLink,
  TableCellText,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { normalizeTextArray } from '../../pages/api/lark/core';
import { larkClient } from '../Base';

export type CommunityMember = Record<
  | 'id'
  | 'name'
  | 'nickname'
  | 'gender'
  | 'avatar'
  | 'community'
  | 'email'
  | 'summary',
  TableCellValue
>;

export const KCC_BASE_ID = process.env.NEXT_PUBLIC_KCC_BASE_ID!;
export const PERSON_TABLE_ID =
  process.env.NEXT_PUBLIC_COMMUNITY_PERSON_TABLE_ID!;

export class CommunityMemberModel extends BiDataTable<CommunityMember>() {
  client = larkClient;

  constructor(appId = KCC_BASE_ID, tableId = PERSON_TABLE_ID) {
    super(appId, tableId);

    makeObservable(this);
  }

  requiredKeys = ['name'] as const;

  sort = { name: 'ASC' } as const;

  @observable
  group: Record<string, CommunityMember[]> = {};

  normalize({
    id,
    fields: { community, email, ...fields },
  }: TableRecord<CommunityMember>) {
    return {
      ...fields,
      id: id!,
      community: normalizeTextArray(community as TableCellText[])[0],
      email: (email as TableCellLink)?.link,
    };
  }
}
