import {
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { larkClient } from './Base';

export type Place = Record<
  | 'id'
  | 'name'
  | 'type'
  | 'openingTime'
  | 'closingTime'
  | 'location'
  | 'volunteers'
  | 'capacity'
  | 'devices'
  | 'photos'
  | 'forum',
  TableCellValue
>;

export class PlaceModel extends BiDataTable<Place>() {
  client = larkClient;

  requiredKeys = ['name', 'type'] as const;

  normalize({ id, fields: { forum, ...fields } }: TableRecord<Place>) {
    return {
      ...fields,
      id,
      forum: (forum as TableCellRelation[])?.map(normalizeText),
    };
  }
}
