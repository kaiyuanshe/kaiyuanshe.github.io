import { makeObservable, observable } from 'mobx';
import {
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { larkClient } from '../Base';

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
  constructor(appId: string, tableId: string) {
    super(appId, tableId);

    makeObservable(this);
  }

  client = larkClient;

  requiredKeys = ['type', 'price'] as const;

  @observable
  group: Record<string, Bill[]> = {};

  normalize({
    id,
    fields: { createdBy, agendas, ...data },
  }: TableRecord<Bill>) {
    return {
      ...data,
      id: id!,
      createdBy: (createdBy as TableCellRelation[])?.map(normalizeText),
      agendas: (agendas as TableCellRelation[])?.map(normalizeText),
    };
  }
}
