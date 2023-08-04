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

export class BillTableModel extends BiTable() {
  client = larkClient;

  @observable
  formMap = {} as Record<string, TableFormViewItem[]>;

  async *loadFormStream() {
    for (const { table_id, name } of this.allItems) {
      const views = await new BillViewModel(this.id, table_id).getAll(),
        forms: TableFormViewItem[] = [];

      for (const { view_type, view_id } of views)
        if (view_type === 'form') {
          const { body } = await this.client.get<LarkFormData>(
            `${this.baseURI}/${table_id}/forms/${view_id}`,
          );
          forms.push(body!.data.form);
        }
      yield [name, forms] as const;
    }
  }

  @action
  @toggle('downloading')
  // @ts-ignore
  async getAll(filter?: Filter<BiTableItem>, pageSize?: number) {
    // @ts-ignore
    const tables = await super.getAll(filter, pageSize);

    const formList: (readonly [string, TableFormViewItem[]])[] = [];

    for await (const item of this.loadFormStream()) formList.push(item);

    this.formMap = Object.fromEntries(formList);

    return tables;
  }
}

export class BillModel extends BiDataTable<Bill>() {
  client = larkClient;

  constructor(appId = MAIN_BASE_ID, tableId = BILL_TABLE_ID) {
    super(appId, tableId);
  }

  requiredKeys = ['createAt', 'price', 'forum', 'agendas'] as const;

  sort = { createAt: 'DESC' } as const;

  @observable
  formMap = {} as BillTableModel['formMap'];

  currentAgenda?: AgendaModel;
  currentForum?: ForumModel;

  normalize({ id, fields, ...meta }: TableRecord<Bill>): Bill {
    return {
      ...fields,
      id: id!,
    };
  }
}
