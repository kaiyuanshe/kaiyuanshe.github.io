import {
  BiDataTable,
  normalizeText,
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecordList,
} from 'mobx-lark';

import { larkClient } from './Base';

export type Forum = Record<
  | 'id'
  | 'producers'
  | 'volunteers'
  | 'startTime'
  | 'endTime'
  | 'description'
  | 'standard'
  | 'type'
  | 'producerAvatars'
  | 'volunteerAvatars',
  TableCellValue
> & { name: string };

export class ForumModel extends BiDataTable<Forum>() {
  client = larkClient;

  requiredKeys = ['name'] as const;

  normalize({
    id,
    fields: {
      producers,
      volunteers,
      producerAvatars,
      volunteerAvatars,
      ...data
    },
  }: TableRecordList<Forum>['data']['items'][number]) {
    return {
      ...data,
      id: id!,
      producers: (producers as TableCellRelation[])?.map(normalizeText),
      volunteers: (volunteers as TableCellRelation[])?.map(normalizeText),
      producerAvatars: producerAvatars,
      volunteerAvatars: volunteerAvatars,
    };
  }
}
