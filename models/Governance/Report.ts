import {
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

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

  normalize({ fields: { meeting, ...fields }, ...meta }: TableRecord<Report>) {
    return {
      ...meta,
      ...fields,
      meeting: (meeting as TableCellRelation[])?.map(normalizeText),
    };
  }
}
