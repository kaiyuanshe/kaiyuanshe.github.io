import {
  TableCellRelation,
  TableCellValue,
  TableRecordList,
} from 'lark-ts-sdk';
import { observable } from 'mobx';
import { ListModel, NewData, Stream } from 'mobx-restful';
import { buildURLData, groupBy, isEmpty } from 'web-utility';

import { client } from './Base';
import { makeFilter, normalizeText } from './Lark';

export type Agenda = Record<
  | 'id'
  | 'title'
  | 'forum'
  | 'mentors'
  | 'mentorAvatars'
  | 'startTime'
  | 'endTime'
  | 'files',
  TableCellValue
>;

export class AgendaModel extends Stream<Agenda>(ListModel) {
  client = client;
  baseURI = '';

  @observable
  group: Record<string, Agenda[]> = {};

  constructor(appId: string, tableId: string) {
    super();
    this.baseURI = `lark/bitable/v1/apps/${appId}/tables/${tableId}/records`;
  }

  normalize({
    id,
    fields: { forum, mentors, ...data },
  }: TableRecordList<Agenda>['data']['items'][number]) {
    return {
      ...data,
      id: id!,
      forum: (forum as TableCellRelation[])?.map(normalizeText),
      mentors: (mentors as TableCellRelation[])?.map(normalizeText),
    };
  }

  async *openStream(filter: NewData<Agenda>) {
    var lastPage = '';

    do {
      const { body } = await this.client.get<TableRecordList<Agenda>>(
        `${this.baseURI}?${buildURLData({
          page_size: 100,
          page_token: lastPage,
          filter: isEmpty(filter) ? undefined : makeFilter(filter),
          sort: JSON.stringify(['startTime ASC']),
        })}`,
      );
      var { items, total, has_more, page_token } = body!.data;

      lastPage = page_token;
      this.totalCount = total;

      yield* items.map(item => this.normalize(item));
    } while (has_more);
  }

  async getGroup() {
    return (this.group = groupBy(
      await this.getAll(),
      ({ forum }) => forum + '',
    ));
  }
}
