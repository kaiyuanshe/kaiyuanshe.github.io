import {
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { normalizeTextArray } from '../../pages/api/lark/core';
import { larkClient } from '../Base';

export type Forum = Record<
  | 'id'
  | 'name'
  | 'producers'
  | 'volunteers'
  | 'startTime'
  | 'endTime'
  | 'location'
  | 'summary'
  | 'standard'
  | 'type'
  | 'producerAvatars'
  | 'volunteerAvatars'
  | 'producerPositions',
  TableCellValue
>;

export class ForumModel extends BiDataTable<Forum>() {
  client = larkClient;

  requiredKeys = ['name', 'summary', 'producers'] as const;

  sort = { startTime: 'ASC' } as const;

  normalize({
    id,
    fields: { producers, volunteers, producerPositions, ...data },
  }: TableRecord<Forum>) {
    return {
      ...data,
      id: id!,
      producers: (producers as TableCellRelation[])?.map(normalizeText),
      volunteers: (volunteers as TableCellRelation[])?.map(normalizeText),
      producerPositions:
        producerPositions &&
        normalizeTextArray(producerPositions as TableCellText[]),
    };
  }
}
