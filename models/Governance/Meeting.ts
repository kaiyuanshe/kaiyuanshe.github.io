import {
  BiDataTable,
  normalizeText,
  TableCellLink,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { larkClient } from '../Base';
import { GOVERNANCE_BASE_ID } from './OKR';

export type Meeting = Record<
  | 'id'
  | 'name'
  | 'title'
  | 'type'
  | 'departments'
  | 'startedAt'
  | 'endedAt'
  | 'location'
  | 'participants'
  | 'groups'
  | 'summary'
  | 'videoCallURL'
  | 'minutesURL'
  | 'proposals'
  | 'reports',
  TableCellValue
>;

export const MEETING_TABLE_ID = process.env.NEXT_PUBLIC_MEETING_TABLE_ID!;

export class MeetingModel extends BiDataTable<Meeting>() {
  client = larkClient;

  constructor(appId = GOVERNANCE_BASE_ID, tableId = MEETING_TABLE_ID) {
    super(appId, tableId);
  }

  normalize({
    fields: {
      title,
      departments,
      videoCallURL,
      minutesURL,
      proposals,
      reports,
      ...fields
    },
    ...meta
  }: TableRecord<Meeting>) {
    return {
      ...meta,
      ...fields,
      title: (title as TableCellText[]).map(normalizeText),
      departments: (departments as TableCellRelation[])?.map(normalizeText),
      videoCallURL: (videoCallURL as TableCellLink)?.link,
      minutesURL: (minutesURL as TableCellLink)?.link,
      proposals: (proposals as TableCellRelation[])?.map(normalizeText),
      reports: (reports as TableCellRelation[])?.map(normalizeText),
    };
  }
}
