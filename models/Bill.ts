import { action, computed, observable } from 'mobx';
import {
  BiDataTable,
  BiTable,
  BiTableItem,
  BiTableView,
  makeSimpleFilter,
  normalizeText,
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecordList,
} from 'mobx-lark';
import { Filter, NewData, toggle } from 'mobx-restful';
import { cache, countBy, groupBy, Hour, isEmpty } from 'web-utility';

import {
  LarkFormData,
  MAIN_BASE_ID,
  TableFormViewItem,
} from '../pages/api/lark/core';
import { Agenda, AgendaModel } from './Agenda';
import { larkClient } from './Base';
import { Forum, ForumModel } from './Forum';

export const BILL_TABLE_ID = process.env.NEXT_PUBLIC_BILL_TABLE_ID!;

export type Bill = Record<
  | 'id'
  | 'createAt'
  | 'location'
  | 'createBy'
  | 'type'
  | 'price'
  | 'invoice'
  | 'remark'
  | 'travelFundTask'
  | 'forum'
  | 'agendas',
  TableCellValue
>;

export type BillStatistic = Record<'price', Record<string, number>>;

export class BillViewModel extends BiTableView() {
  client = larkClient;
}

export class BillTableModel extends BiDataTable<Bill>() {
  client = larkClient;

  requiredKeys = ['price', 'invoice', 'forum', 'agendas'] as const;

  sort = { createAt: 'ASC' } as const;

  @observable
  group: Record<string, Bill[]> = {};

  async getGroup() {
    return (this.group = groupBy(
      await this.getAll(),
      ({ forum }) => forum + '',
    ));
  }
}
