import {
  BiDataTable,
  normalizeText,
  TableCellLink,
  TableCellRelation,
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
    fields: {
      title,
      types,
      issues,
      contentURL,
      createdBy,
      meetings,
      ...fields
    },
    ...meta
  }: TableRecord<Proposal>) {
    return {
      ...meta,
      ...fields,
      title: normalizeTextArray(title as TableCellText[])?.[0] || '',
      types: types,
      issues: normalizeTextArray(issues as TableCellText[]),
      contentURL: (contentURL as TableCellLink)?.link,
      createdBy: (createdBy as TableCellUser)?.name || '',
      meetings: (meetings as TableCellRelation[])?.map(normalizeText),
    };
  }
}

export default new ProposalModel();
