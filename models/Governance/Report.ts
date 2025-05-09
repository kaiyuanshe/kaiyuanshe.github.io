import {
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { normalizeMarkdownArray } from '../../utility/Lark';
import { larkClient } from '../Base';
import { GOVERNANCE_BASE_ID } from './OKR';

export type Report = Record<
  | 'id'
  | `created${'At' | 'By'}`
  | 'summary'
  | 'department'
  | 'plan'
  | 'progress'
  | 'product'
  | 'problem'
  | 'meeting',
  TableCellValue
>;

export const REPORT_TABLE_ID = process.env.NEXT_PUBLIC_REPORT_TABLE_ID!;

export class ReportModel extends BiDataTable<Report>() {
  client = larkClient;

  constructor(appId = GOVERNANCE_BASE_ID, tableId = REPORT_TABLE_ID) {
    super(appId, tableId);
  }

  extractFields({
    fields: { department, plan, progress, product, problem, meeting, ...fields },
    ...meta
  }: TableRecord<Report>) {
    return {
      ...meta,
      ...fields,
      department: (department as TableCellRelation[])?.map(normalizeText),
      plan: plan && normalizeMarkdownArray(plan as TableCellText[]),
      progress: progress && normalizeMarkdownArray(progress as TableCellText[]),
      product: product && normalizeMarkdownArray(product as TableCellText[]),
      problem: problem && normalizeMarkdownArray(problem as TableCellText[]),
      meeting: (meeting as TableCellRelation[])?.map(normalizeText),
    };
  }
}
