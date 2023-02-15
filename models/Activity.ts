import { computed, observable } from 'mobx';
import {
  BiDataTable,
  BiTable,
  makeSimpleFilter,
  normalizeText,
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecordList,
} from 'mobx-lark';
import { NewData, toggle } from 'mobx-restful';
import { cache, countBy, Hour, isEmpty } from 'web-utility';

import { MAIN_BASE_ID } from '../pages/api/lark/core';
import { Agenda, AgendaModel } from './Agenda';
import { larkClient } from './Base';

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
  | 'database',
  TableCellValue
>;

export type ActivityStatistic = Record<'city', Record<string, number>>;

export class ActivityTableModel extends BiTable<Agenda>() {
  client = larkClient;
}

export class ActivityModel extends BiDataTable<Activity>() {
  client = larkClient;

  constructor(appId = MAIN_BASE_ID, tableId = ACTIVITY_TABLE_ID) {
    super(appId, tableId);
  }

  requiredKeys = ['name', 'startTime', 'image'] as const;

  sort = { startTime: 'DESC' } as const;

  currentAgenda?: AgendaModel;

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

    return { startTime, endTime };
  }

  normalize({
    id,
    fields: { organizers, link, database, ...fields },
  }: TableRecordList<Activity>['data']['items'][number]) {
    return {
      ...fields,
      id: id!,
      organizers: (organizers as TableCellRelation[])?.map(normalizeText),
      link: normalizeText(link as TableCellLink),
      database: (database as TableCellLink)?.link,
    };
  }

  @toggle('downloading')
  async getOne(id: string) {
    const { database } = await super.getOne(id);

    if (database) {
      const table = new ActivityTableModel((database + '').split('/').at(-1)!);

      await table.getOne('Agenda', AgendaModel);

      this.currentAgenda = table.currentDataTable as AgendaModel;
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
