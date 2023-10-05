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
  | 'score'
  | '负责人手机号',
  TableCellValue
> & {
  fileInfo: TableCellAttachment[];
};

interface AgendaFilter extends Filter<Agenda> {
  负责人手机号: TableCellValue;
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
    const { forum, mentors, mentorPositions, mentorSummaries, score, ...data } =
      fields;

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
    };
  }

  async getOne(id: string) {
    await super.getOne(id);

    const { title, mentors, 负责人手机号 } = this.currentOne;

    this.currentRecommend = new SearchAgendaModel(this.appId, this.tableId);

    const segmenter = new Intl.Segmenter('zh', {
      type: 'word',
    } as SegmenterOptions);

    const segments = segmenter.segment(title + '');

    const words: string[] = [];

    for (const segment of segments) {
      words.push(segment.segment);
    }

    console.log(words);

    await this.currentRecommend!.getList({
      负责人手机号,
      mentors,
      title: words,
      summary: words,
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
  makeFilter(filter: AgendaFilter) {
    return isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');
  }
}
