import {
  BiDataTable,
  makeSimpleFilter,
  normalizeText,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { NewData } from 'mobx-restful';
import { isEmpty } from 'web-utility';

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

  makeFilter({  ...filter }: Partial<NewData<Issue>>) {
    return [
      
      !isEmpty(filter) && makeSimpleFilter(filter),
    ]
      .filter(Boolean)
      .join('&&');
  }

  normalize({
    fields: {
      title,
      detail,
      type,
      deadline,
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
      title: title && normalizeTextArray(title as TableCellText[]),
      detail: detail && normalizeTextArray(detail as TableCellText[]),
      type: (type as string)?.trim().split(/\s+/),
      deadline: deadline && normalizeTextArray(deadline as TableCellText[]),
      department: (department as TableCellRelation[])?.map(normalizeText),
      proposals: (proposals as TableCellRelation[])?.map(normalizeText),
      meeting: (meeting as TableCellRelation[])?.map(normalizeText),
    };
  }
}

export default new IssueModel();
