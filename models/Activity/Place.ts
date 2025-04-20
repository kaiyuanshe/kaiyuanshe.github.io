import {
  BiDataQueryOptions,
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { larkClient } from '../Base';

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
  | 'forum'
  | 'bill',
  TableCellValue
>;

export class PlaceModel extends BiDataTable<Place>() {
  client = larkClient;

  requiredKeys = ['name', 'type', 'bill'] as const;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  extractFields({
    id,
    fields: { forum, bill, ...fields },
  }: TableRecord<Place>) {
    return {
      ...fields,
      id,
      forum: (forum as TableCellRelation[])?.map(normalizeText),
      bill: (bill as TableCellRelation[])?.map(normalizeText),
    };
  }
}
