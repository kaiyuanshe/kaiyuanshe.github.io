import { action, computed, makeObservable, observable } from 'mobx';
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
} from 'mobx-lark';
import { Filter, NewData, toggle } from 'mobx-restful';
import { cache, countBy, Hour, isEmpty } from 'web-utility';

import {
  LarkFormData,
  MAIN_BASE_ID,
  TableFormViewItem,
} from '../../pages/api/lark/core';
import { larkClient } from '../Base';
import { AgendaModel } from './Agenda';
import { BillModel } from './Bill';
import { ForumModel } from './Forum';
import { PlaceModel } from './Place';
import { StaffModel } from './Staff';

export const ACTIVITY_TABLE_ID = process.env.NEXT_PUBLIC_ACTIVITY_TABLE_ID!;

export type Activity = Record<
  | 'id'
  | 'name'
  | 'startTime'
  | 'endTime'
  | 'city'
  | 'location'
  | 'organizers'
  | 'link'
  | 'image'
  | 'cardImage'
  | 'database',
  TableCellValue
>;

export type ActivityStatistic = Record<'city', Record<string, number>>;

export class ActivityViewModel extends BiTableView() {
  client = larkClient;
}

export class ActivityTableModel extends BiTable() {
  constructor(id = '') {
    super(id);
    makeObservable(this);
  }

  client = larkClient;

  @observable
  formMap = {} as Record<string, TableFormViewItem[]>;

  async *loadFormStream() {
    for (const { table_id, name } of this.allItems) {
      const views = await new ActivityViewModel(this.id, table_id).getAll(),
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

export class ActivityModel extends BiDataTable<Activity>() {
  client = larkClient;

  constructor(appId = MAIN_BASE_ID, tableId = ACTIVITY_TABLE_ID) {
    super(appId, tableId);

    makeObservable(this);
  }

  requiredKeys = ['name', 'startTime', 'image'] as const;

  sort = { startTime: 'DESC' } as const;

  @observable
  formMap = {} as ActivityTableModel['formMap'];

  currentForum?: ForumModel;
  currentAgenda?: AgendaModel;
  currentPlace?: PlaceModel;
  currentBill?: BillModel;
  currentStaff?: StaffModel;

  declare statistic: ActivityStatistic;

  @computed
  get currentMeta() {
    const list =
      this.currentAgenda?.allItems.filter(
        ({ startTime, endTime }) => startTime && endTime,
      ) || [];
    const { startTime } = list[0] || {},
      { endTime } = list.slice(-1)[0] || {};
    const { Person, Agenda, File, Bill } = this.formMap;

    return {
      startTime,
      endTime,
      personForms: Person.filter(({ shared_url }) => shared_url),
      agendaForms: Agenda.filter(({ shared_url }) => shared_url),
      fileForms: File.filter(({ shared_url }) => shared_url),
      billForms: Bill.filter(({ shared_url }) => shared_url),
    };
  }

  normalize({
    id,
    fields: { organizers, link, database, ...fields },
  }: TableRecord<Activity>) {
    return {
      ...fields,
      id: id!,
      organizers: (organizers as TableCellRelation[])?.map(normalizeText),
      link: (link as TableCellLink)?.link,
      database: (database as TableCellLink)?.link,
    };
  }

  @toggle('downloading')
  async getOne(id: string) {
    const { database } = await super.getOne(id);

    if (database) {
      const dbName = (database + '').split('/').at(-1)!;
      const table = new ActivityTableModel(dbName);

      await table.getOne('Forum', ForumModel);
      this.currentForum = table.currentDataTable as ForumModel;

      await table.getOne('Agenda', AgendaModel);
      this.currentAgenda = table.currentDataTable as AgendaModel;

      await table.getOne('Place', PlaceModel);
      this.currentPlace = table.currentDataTable as PlaceModel;

      await table.getOne('Bill', BillModel);
      this.currentBill = table.currentDataTable as BillModel;

      await table.getOne('Person', StaffModel);
      this.currentStaff = table.currentDataTable as unknown as StaffModel;

      this.formMap = table.formMap;
    }
    return this.currentOne;
  }

  getStatistic = cache(async clean => {
    const list = await this.getAll();

    setTimeout(clean, Hour / 2);

    return (this.statistic = { city: countBy(list, 'city') });
  }, 'Activity Statistic');
}

export type StatisticTrait = Pick<ActivityModel, 'statistic' | 'getStatistic'>;

export class SearchActivityModel extends ActivityModel {
  makeFilter(filter: NewData<Activity>) {
    return isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');
  }
}

export default new ActivityModel();
