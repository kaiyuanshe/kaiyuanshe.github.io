import {
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecord,
  TableCellUser
} from 'mobx-lark';

import { normalizeTextArray } from '../../pages/api/lark/core';
import { larkClient } from '../Base';

export const GOVERNANCE_BASE_ID = process.env.NEXT_PUBLIC_GOVERNANCE_BASE_ID!,
  ISSUE_TABLE_ID = process.env.NEXT_PUBLIC_ISSUE_TABLE_ID!;

export type Issue = Record<
  | 'id'
  | 'title'
  | 'detail'
  | 'type'
  | 'deadline'
  | `created${'At' | 'By'}`
  | 'department'
  | 'proposals'
  | 'meeting',
  TableCellValue
>;

export class IssueModel extends BiDataTable<Issue>() {
  client = larkClient;

  constructor(appId = GOVERNANCE_BASE_ID, tableId = ISSUE_TABLE_ID) {
    super(appId, tableId);
  }

  normalize({
    fields: {
      title,
      detail,
      type,
      createdBy,

      department,
      proposals,
      meeting,
      ...fields
    },
    ...meta
  }: TableRecord<Issue>) {
    return {
      ...meta,
      ...fields,
      title: normalizeTextArray(title as TableCellText[])?.[0] || '',
      detail: JSON.stringify(detail),
      type: (type as string)?.trim().split(/\s+/),
      createdBy: (createdBy as TableCellUser)?.en_name || '',
      department: (department as TableCellRelation[])?.map(normalizeText),
      proposals: (proposals as TableCellRelation[])?.map(normalizeText),
      meeting: (meeting as TableCellRelation[])?.map(normalizeText),
    };
  }
}

export default new IssueModel();
