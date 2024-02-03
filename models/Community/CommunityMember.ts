import { observable } from 'mobx';
import {
  BiDataQueryOptions,
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
  | 'summary'
  | 'approver',
  TableCellValue
>;

export const KCC_BASE_ID = process.env.NEXT_PUBLIC_KCC_BASE_ID!;
export const PERSON_TABLE_ID =
  process.env.NEXT_PUBLIC_COMMUNITY_PERSON_TABLE_ID!;

export class CommunityMemberModel extends BiDataTable<CommunityMember>() {
  client = larkClient;

  constructor(appId = KCC_BASE_ID, tableId = PERSON_TABLE_ID) {
    super(appId, tableId);
  }

  requiredKeys = ['name', 'approver'] as const;

  sort = { name: 'ASC' } as const;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  @observable
  accessor group: Record<string, CommunityMember[]> = {};

  normalize({
    id,
    fields: { community, email, approver, ...fields },
  }: TableRecord<CommunityMember>) {
    return {
      ...fields,
      id: id!,
      community: normalizeTextArray(community as TableCellText[])[0],
      email: (email as TableCellLink)?.link,
      approver: normalizeTextArray(approver as TableCellText[])[0],
    };
  }
}
