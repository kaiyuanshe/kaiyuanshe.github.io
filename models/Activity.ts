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
import { cache, countBy, Hour, isEmpty } from 'web-utility';

import {
  LarkFormData,
  MAIN_BASE_ID,
  TableFormViewItem,
} from '../pages/api/lark/core';
import { Agenda, AgendaModel } from './Agenda';
import { larkClient } from './Base';
import { Forum, ForumModel } from './Forum';

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

export class ActivityTableModel extends BiTable<Agenda>() {
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

export class ForumTableModel extends BiTable<Forum>() {
  client = larkClient;
}

export class ActivityModel extends BiDataTable<Activity>() {
  client = larkClient;

  constructor(appId = MAIN_BASE_ID, tableId = ACTIVITY_TABLE_ID) {
    super(appId, tableId);
  }

  requiredKeys = ['name', 'startTime', 'image'] as const;

  sort = { startTime: 'DESC' } as const;

  @observable
  formMap = {} as ActivityTableModel['formMap'];

  currentAgenda?: AgendaModel;
  currentForum?: ForumModel;

  @observable
  statistic: ActivityStatistic = {} as ActivityStatistic;

  @computed
  get currentMeta() {
    const list =
      this.currentAgenda?.allItems.filter(
        ({ startTime, endTime }) => startTime && endTime,
      ) || [];
    const { startTime } = list[0] || {},
      { endTime } = list.slice(-1)[0] || {};
    const { Person, Agenda, File } = this.formMap;

    return {
      startTime,
      endTime,
      personForm: Person[0]?.shared_url,
      agendaForm: Agenda[0]?.shared_url,
      fileForm: File[0]?.shared_url,
    };
  }

  normalize({
    id,
    fields: { organizers, link, database, ...fields },
  }: TableRecordList<Activity>['data']['items'][number]) {
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
      const forumTable = new ForumTableModel(dbName);

      await table.getOne('Agenda', AgendaModel);
      await forumTable.getOne('Forum', ForumModel);

      this.formMap = table.formMap;
      this.currentAgenda = table.currentDataTable as AgendaModel;
      this.currentForum = forumTable.currentDataTable as ForumModel;
    }
    return this.currentOne;
  }

  getStatistic = cache(async clean => {
    const list = await this.getAll();

    setTimeout(clean, Hour / 2);

    return (this.statistic = { city: countBy(list, 'city') });
  }, 'Activity Statistic');
}

export class SearchActivityModel extends ActivityModel {
  makeFilter(filter: NewData<Activity>) {
    return isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');
  }
}

export default new ActivityModel();
