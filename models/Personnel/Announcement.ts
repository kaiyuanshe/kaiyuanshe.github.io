import {
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { normalizeMarkdownArray } from '../../pages/api/lark/core';
import { larkClient } from '../Base';
import { HR_BASE_ID } from './Person';

export type Announcement = Record<
  | 'id'
  | 'createdAt'
  | 'createdBy'
  | 'title'
  | 'tags'
  | 'departments'
  | 'content'
  | 'files'
  | 'emails'
  | 'publishedAt',
  TableCellValue
>;

export const ANNOUNCEMENT_TABLE_ID =
  process.env.NEXT_PUBLIC_ANNOUNCEMENT_TABLE_ID!;

export class AnnouncementModel extends BiDataTable<Announcement>() {
  client = larkClient;

  constructor(appId = HR_BASE_ID, tableId = ANNOUNCEMENT_TABLE_ID) {
    super(appId, tableId);
  }

  extractFields({
    fields: { title, content, departments, ...fields },
    ...meta
  }: TableRecord<Announcement>) {
    return {
      ...meta,
      ...fields,
      title: (title as TableCellText[]).map(normalizeText),
      content: normalizeMarkdownArray(content as TableCellText[]),
      departments: (departments as TableCellRelation[]).map(normalizeText),
    };
  }
}
