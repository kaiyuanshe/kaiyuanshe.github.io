import { observable } from 'mobx';
import {
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { larkClient } from './Base';

export type Bill = Record<
  | 'id'
  | 'createdAt'
  | 'createdBy'
  | 'location'
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

  @observable
  group: Record<string, Bill[]> = {};

  normalize({
    id,
    fields: { createdBy, agendas, ...data },
  }: TableRecord<Bill>) {
    return {
      ...data,
      id: id!,
      createdBy: (createdBy as TableCellRelation[])?.map(item =>
        normalizeText(item),
      ),
      agendas: (agendas as TableCellRelation[])?.map(agenda =>
        normalizeText(agenda),
      ),
    };
  }
}
