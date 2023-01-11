import { observable } from 'mobx';
import { NewData, ListModel, Stream, toggle } from 'mobx-restful';
import { TableCellLink, TableCellRelation, TableRecordList } from 'lark-ts-sdk';

import { client } from './Base';
import {
  createListStream,
  normalizeText,
  LARK_BITABLE_ID,
  LARK_BITABLE_ACTIVITY_ID,
} from './Lark';
import { AgendaModel } from './Agenda';
import { TableData, TableRecordData } from '../pages/api/lark/core';
import { Activity } from '../pages/api/activity';
import { ActivityStatistic } from '../pages/api/activity/statistic';

export class ActivityModel extends Stream<Activity>(ListModel) {
  client = client;
  baseURI = 'activity';

  currentAgenda?: AgendaModel;

  @observable
  statistic: ActivityStatistic = {} as ActivityStatistic;

  normalize = ({
    id,
    fields: { organizers, link, database, ...fields },
  }: TableRecordList<Activity>['data']['items'][number]): Activity => ({
    ...fields,
    id: id!,
    organizers: (organizers as TableCellRelation[])?.map(normalizeText),
    link: normalizeText(link as TableCellLink),
    database: (database as TableCellLink)?.link,
  });

  @toggle('downloading')
  async getOne(id: string) {
    const { body } = await this.client.get<TableRecordData<Activity>>(
      `lark/bitable/v1/apps/${LARK_BITABLE_ID}/tables/${LARK_BITABLE_ACTIVITY_ID}/records/${id}`,
    );
    const { database } = (this.currentOne = this.normalize(body!.data.record));

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

  async *openStream(filter: NewData<Activity>) {
    for await (const { total, items } of createListStream<Activity>(
      this.client,
      this.baseURI,
      filter,
    )) {
      this.totalCount = total;

      yield* items?.map(this.normalize) || [];
    }
  }

  @toggle('downloading')
  async getStatistic() {
    const { body } = await this.client.get<ActivityStatistic>(
      `${this.baseURI}/statistic`,
    );
    return (this.statistic = body!);
  }
}

export default new ActivityModel();
