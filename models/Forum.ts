import {
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecordList,
} from 'mobx-lark';

import { normalizeTextArray } from '../pages/api/lark/core';
import { larkClient } from './Base';

export type Forum = Record<
  | 'id'
  | 'name'
  | 'producers'
  | 'volunteers'
  | 'startTime'
  | 'endTime'
  | 'description'
  | 'standard'
  | 'type'
  | 'producerAvatars'
  | 'volunteerAvatars'
  | 'producerPositions',
  TableCellValue
>;

export class ForumModel extends BiDataTable<Forum>() {
  client = larkClient;

  requiredKeys = ['name'] as const;

  sort = { startTime: 'ASC' } as const;

  normalize({
    id,
    fields: { producers, volunteers, producerPositions, ...data },
  }: TableRecordList<Forum>['data']['items'][number]) {
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
