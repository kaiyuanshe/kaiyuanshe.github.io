import { observable } from 'mobx';
import {
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellValue,
  TableRecordList,
} from 'mobx-lark';
import { groupBy } from 'web-utility';
import { larkClient } from './Base';

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

export class AgendaModel extends BiDataTable<Agenda>() {
  client = larkClient;

  requiredKeys = ['title', 'mentors', 'startTime', 'endTime'] as const;

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
