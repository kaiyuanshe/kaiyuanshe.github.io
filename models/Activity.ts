import {
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecordList,
} from 'lark-ts-sdk';
import { observable } from 'mobx';
import { toggle } from 'mobx-restful';
import { cache, countBy, Hour } from 'web-utility';

import { TableData } from '../pages/api/lark/core';
import { AgendaModel } from './Agenda';
import { BiTable, MAIN_BASE_ID, normalizeText } from './Lark';

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

export class ActivityModel extends BiTable<Activity>() {
  constructor(appId = MAIN_BASE_ID, tableId = ACTIVITY_TABLE_ID) {
    super(appId, tableId);
  }

  sort = { startTime: 'DESC' } as const;

  currentAgenda?: AgendaModel;

  @observable
  statistic: ActivityStatistic = {} as ActivityStatistic;

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
      const appId = (database + '').split('/').at(-1)!;

      const { body: tableData } = await this.client.get<TableData>(
        `lark/bitable/v1/apps/${appId}/tables?page_size=100`,
      );
      const { table_id } =
        tableData!.data.items.find(({ name }) => name === 'Agenda') || {};

      if (!table_id) throw new ReferenceError('"Agenda" table is missing');

      this.currentAgenda = new AgendaModel(appId, table_id);
    }
    return this.currentOne;
  }

  getStatistic = cache(async clean => {
    const list = await this.getAll();

    setTimeout(clean, Hour / 2);

    return (this.statistic = { city: countBy(list, 'city') });
  }, 'Activity Statistic');
}

export default new ActivityModel();
