import { BiDataTable, TableCellValue } from 'mobx-lark';

import { larkClient } from './Base';

export type Bill = Record<
  | 'id'
  | 'createdAt'
  | 'location'
  | 'createdBy'
  | 'type'
  | 'price'
  | 'invoice'
  | 'remark'
  | 'travelFundTask'
  | 'forum'
  | 'agendas',
  TableCellValue
>;

export class BillModel extends BiDataTable<Bill>() {
  client = larkClient;

  requiredKeys = ['price'] as const;
}
