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
  TableRecord,
  TableRecordList,
} from 'mobx-lark';
import { Filter, NewData, RESTClient, toggle } from 'mobx-restful';
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

  constructor(appId = MAIN_BASE_ID, tableId = BILL_TABLE_ID) {
    super(appId, tableId);
  }

  requiredKeys = ['price'] as const;

  sort = { createAt: 'ASC' } as const;
}
