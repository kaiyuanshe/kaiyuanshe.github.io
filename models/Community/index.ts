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
import { AgendaModel } from '../Activity/Agenda';
import { BillModel } from '../Activity/Bill';
import { ForumModel } from '../Activity/Forum';
import { PlaceModel } from '../Activity/Place';
import { larkClient } from '../Base';

export const COMMUNITY_TABLE_ID = process.env.NEXT_PUBLIC_COMMUNITY_TABLE_ID!;

export type Community = Record<'name' | 'logo', TableCellValue>;

export type CommunityStatistic = Record<'city', Record<string, number>>;

export class CommunityViewModel extends BiTableView() {
  client = larkClient;
}

export class CommunityTableModel extends BiTable() {
  constructor(id = '') {
    super(id);
    makeObservable(this);
  }

  client = larkClient;

  @observable
  formMap = {} as Record<string, TableFormViewItem[]>;

  async *loadFormStream() {
    for (const { table_id, name } of this.allItems) {
      const views = await new CommunityViewModel(this.id, table_id).getAll(),
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

export class CommunityModel extends BiDataTable<Community>() {
  client = larkClient;

  constructor(appId = MAIN_BASE_ID, tableId = COMMUNITY_TABLE_ID) {
    super(appId, tableId);

    makeObservable(this);
  }

  requiredKeys = ['name', 'startTime', 'image'] as const;

  sort = { startTime: 'DESC' } as const;

  @observable
  formMap = {} as CommunityTableModel['formMap'];

  currentForum?: ForumModel;
  currentAgenda?: AgendaModel;
  currentPlace?: PlaceModel;
  currentBill?: BillModel;

  declare statistic: CommunityStatistic;

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
  }: TableRecord<Community>) {
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
      const table = new CommunityTableModel(dbName);

      await table.getOne('Forum', ForumModel);
      this.currentForum = table.currentDataTable as ForumModel;

      await table.getOne('Agenda', AgendaModel);
      this.currentAgenda = table.currentDataTable as AgendaModel;

      await table.getOne('Place', PlaceModel);
      this.currentPlace = table.currentDataTable as PlaceModel;

      await table.getOne('Bill', BillModel);
      this.currentBill = table.currentDataTable as BillModel;

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

export type StatisticTrait = Pick<CommunityModel, 'statistic' | 'getStatistic'>;

export class SearchActivityModel extends CommunityModel {
  makeFilter(filter: NewData<Community>) {
    return isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');
  }
}

export default new CommunityModel();
