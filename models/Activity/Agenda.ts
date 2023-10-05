import { makeObservable, observable } from 'mobx';
import {
  BiDataTable,
  makeSimpleFilter,
  normalizeText,
  TableCellAttachment,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { Filter } from 'mobx-restful';
import { groupBy, isEmpty } from 'web-utility';

import { normalizeTextArray } from '../../pages/api/lark/core';
import { larkClient } from '../Base';

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
  | 'approver'
  | '负责人手机号',
  TableCellValue
> & {
  fileInfo: TableCellAttachment[];
};

interface AgendaFilter extends Filter<Agenda> {
  负责人手机号: TableCellValue;
}

export class AgendaModel extends BiDataTable<Agenda, AgendaFilter>() {
  constructor(appId: string, tableId: string) {
    super(appId, tableId);
    this.appId = appId;
    this.tableId = tableId;
    makeObservable(this);
  }

  client = larkClient;

  appId;

  tableId;

  currentRecommend?: AgendaModel;

  requiredKeys = ['title', 'mentors', 'approver'] as const;

  sort = { startTime: 'ASC' } as const;

  @observable
  group: Record<string, Agenda[]> = {};

  @observable
  currentAuthorized = false;

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

  async getOne(id: string) {
    await super.getOne(id);

    const { mentors, title, 负责人手机号 } = this.currentOne;

    this.currentRecommend = new SearchAgendaModel(this.appId, this.tableId);

    await this.currentRecommend!.getList({
      mentors,
      summary: title,
      负责人手机号,
    });

    return this.currentOne;
  }

  async getGroup() {
    return (this.group = groupBy(
      await this.getAll(),
      ({ forum }) => forum + '',
    ));
  }

  async checkAuthorization(title: string, mobilePhone: string) {
    mobilePhone = mobilePhone.replace(/^\+86-?/, '');

    const [matched] = await this.getList({ title, 负责人手机号: mobilePhone });

    return (this.currentAuthorized = !!matched);
  }
}

export class SearchAgendaModel extends AgendaModel {
  constructor(appId: string, tableId: string) {
    super(appId, tableId);
  }

  makeFilter(filter: AgendaFilter) {
    return isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');
  }
}
