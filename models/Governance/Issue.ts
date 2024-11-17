import {
  BiDataTable,
  makeSimpleFilter,
  normalizeText,
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
}

function makeFilter({ createdAt, ...filter }: Partial<NewData<Issue>>) {
  return [
    `createdAt>=${createdAt}`,
    !isEmpty(filter) && makeSimpleFilter(filter),
  ]
    .filter(Boolean)
    .join('&&');
}


 function normalize({
  fields: {
    title,
        detail,
        type,
        deadline,
        proposals,
        meeting,
        ...fields 
    },
    ...meta
}: TableRecord<Issue>) {
    return {
        ...meta,
    ...fields,
    title: title && normalizeText(title as TableCellText),
    detail: detail && normalizeText(detail as TableCellText),
    type: type && normalizeTextArray(type as TableCellText),
    deadline: deadline && normalizeText(deadline as TableCellText),
    proposals: proposals && normalizeTextArray(proposals as TableCellText[]),
    meeting: meeting && normalizeText(meeting as TableCellText),
  };
}