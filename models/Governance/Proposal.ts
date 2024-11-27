import {
  BiDataTable,
  TableCellLink,
  TableCellText,
  TableCellUser,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { normalizeTextArray } from '../../pages/api/lark/core';
import { larkClient } from '../Base';

export const GOVERNANCE_BASE_ID = process.env.NEXT_PUBLIC_GOVERNANCE_BASE_ID!;
export const PROPOSAL_TABLE_ID = process.env.NEXT_PUBLIC_PROPOSAL_TABLE_ID!;

export type Proposal = Record<
  | 'id'
  | 'title'
  | 'types'
  | 'issues'
  | 'contentURL'
  | `created${'At' | 'By'}`
  | 'meetings'
  | 'voteURL'
  | 'passed',
  TableCellValue
>;

export class ProposalModel extends BiDataTable<Proposal>() {
  client = larkClient;

  constructor(appId = GOVERNANCE_BASE_ID, tableId = PROPOSAL_TABLE_ID) {
    super(appId, tableId);
  }

  normalize({
    fields: { title, contentURL, createdBy, ...fields },
    ...meta
  }: TableRecord<Proposal>) {
    return {
      ...meta,
      ...fields,
      title: normalizeTextArray(title as TableCellText[])?.[0] || '',
      contentURL: (contentURL as TableCellLink)?.link || '',
      createdBy: (createdBy as TableCellUser)?.name || '',
    };
  }
}

export default new ProposalModel();
