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
  | 'tags'
  | 'forum'
  | 'mentors'
  | 'mentorAvatars'
  | 'mentorPositions'
  | 'mentorSummaries'
  | 'startTime'
  | 'endTime'
  | 'approver'
  | 'score'
  | '负责人手机号',
  TableCellValue
> & {
  fileInfo: TableCellAttachment[];
};

interface AgendaFilter extends Filter<Agenda> {
  负责人手机号?: TableCellValue;
}

export class AgendaModel extends BiDataTable<Agenda, AgendaFilter>() {
  constructor(
    public appId: string,
    public tableId: string,
  ) {
    super(appId, tableId);

    makeObservable(this);
  }

  client = larkClient;

  currentRecommend?: AgendaModel;

  requiredKeys = ['title', 'mentors', 'approver'] as const;

  sort = { startTime: 'ASC' } as const;

  @observable
  group: Record<string, Agenda[]> = {};

  @observable
  currentAuthorized = false;

  normalize({ id, fields }: TableRecord<Agenda>) {
    const {
      forum,
      mentors,
      mentorPositions,
      mentorSummaries,
      score,
      tags,
      ...data
    } = fields;

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
      score: typeof score === 'number' ? score : null,
      tags: (tags as string)?.trim().split(/\s+/),
    };
  }

  async getOne(id: string) {
    await super.getOne(id);

    const { mentors, tags, forum } = this.currentOne;

    this.currentRecommend = new SearchAgendaModel(this.appId, this.tableId);

    (
      await this.currentRecommend!.getList({
        mentors,
        tags: tags,
      })
    )
      .map(item => ({ item, priority: item.forum === forum ? 0 : 1 }))
      .sort((a, b) => a.priority - b.priority)
      .map(entry => entry.item);

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
  sort = { forum: 'ASC', startTime: 'ASC' } as const;

  makeFilter(filter: AgendaFilter) {
    return isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');
  }
}
