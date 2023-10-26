import {
  BiDataTable,
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
  | 'producerPositions'
  | 'producerOrganizations',
  TableCellValue
>;

export class ForumModel extends BiDataTable<Forum>() {
  client = larkClient;

  requiredKeys = ['name', 'summary', 'producers'] as const;

  sort = { type: 'ASC', startTime: 'ASC' } as const;

  normalize({
    id,
    fields: {
      producers,
      volunteers,
      producerPositions,
      producerOrganizations,
      location,
      ...data
    },
  }: TableRecord<Forum>) {
    return {
      ...data,
      id: id!,
      producers: (producers as TableCellRelation[])?.flatMap(
        ({ text_arr }) => text_arr,
      ),
      volunteers: (volunteers as TableCellRelation[])?.flatMap(
        ({ text_arr }) => text_arr,
      ),
      producerPositions:
        producerPositions &&
        normalizeTextArray(producerPositions as TableCellText[]),
      producerOrganizations:
        producerOrganizations &&
        normalizeTextArray(producerOrganizations as TableCellText[]),
      location: location && normalizeTextArray(location as TableCellText[]),
    };
  }
}
