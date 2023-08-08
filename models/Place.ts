import { BiDataTable, TableCellValue } from 'mobx-lark';

import { larkClient } from './Base';

export type Place = Record<
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
}
