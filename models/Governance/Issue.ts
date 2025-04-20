import {
  BiDataTable,
  normalizeText,
  normalizeTextArray,
  TableCellRelation,
  TableCellText,
  TableCellUser,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

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
  | 'meetings',
  TableCellValue
>;

export class IssueModel extends BiDataTable<Issue>() {
  client = larkClient;

  constructor(appId = GOVERNANCE_BASE_ID, tableId = ISSUE_TABLE_ID) {
    super(appId, tableId);
  }

  extractFields({
    fields: { title, type, createdBy, department, ...fields },
    ...meta
  }: TableRecord<Issue>) {
    return {
      ...meta,
      ...fields,
      title: normalizeTextArray(title as TableCellText[])?.[0] || '',
      type: (type as string)?.trim().split(/\s+/),
      createdBy: (createdBy as TableCellUser)?.name || '',
      department: (department as TableCellRelation[])?.map(normalizeText),
    };
  }
}

export default new IssueModel();
