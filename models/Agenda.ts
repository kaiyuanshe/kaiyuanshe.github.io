import { makeObservable, observable } from 'mobx';
import {
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { groupBy } from 'web-utility';

import { normalizeTextArray } from '../pages/api/lark/core';
import { larkClient } from './Base';

export type Agenda = Record<
  | 'id'
  | 'type'
  | 'title'
  | 'summary'
  | 'forum'
  | 'mentors'
  | 'mentorAvatars'
  | 'mentorPositions'
  | 'mentorSummaries'
  | 'startTime'
  | 'endTime'
  | 'files'
  | 'approver',
  TableCellValue
>;

export class AgendaModel extends BiDataTable<Agenda>() {
  constructor(appId: string, tableId: string) {
    super(appId, tableId);

    makeObservable(this);
  }

  client = larkClient;

  requiredKeys = [
    'title',
    'mentors',
    'startTime',
    'endTime',
    'approver',
  ] as const;

  sort = { startTime: 'ASC' } as const;

  @observable
  group: Record<string, Agenda[]> = {};

  normalize({
    id,
    fields: { forum, mentors, mentorPositions, mentorSummaries, ...data },
  }: TableRecord<Agenda>) {
    return {
      ...data,
      id: id!,
      forum: (forum as TableCellRelation[])?.map(normalizeText),
      mentors: (mentors as TableCellRelation[])
        ?.map(mentor => normalizeText(mentor).split(','))
        .flat(),
      mentorPositions:
        mentorPositions &&
        normalizeTextArray(mentorPositions as TableCellText[]),
      mentorSummaries:
        mentorSummaries &&
        normalizeTextArray(mentorSummaries as TableCellText[]),
    };
  }

  async getGroup() {
    return (this.group = groupBy(
      await this.getAll(),
      ({ forum }) => forum + '',
    ));
  }
}
