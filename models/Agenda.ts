import {
  TableCellRelation,
  TableCellValue,
  TableRecordList,
} from 'lark-ts-sdk';
import { observable } from 'mobx';
import { ListModel } from 'mobx-restful';
import { groupBy } from 'web-utility';

import { BiTable, normalizeText } from './Lark';

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

export class AgendaModel extends BiTable<Agenda>(ListModel) {
  sort = { startTime: 'ASC' } as const;

  @observable
  group: Record<string, Agenda[]> = {};

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

  async getGroup() {
    return (this.group = groupBy(
      await this.getAll(),
      ({ forum }) => forum + '',
    ));
  }
}
