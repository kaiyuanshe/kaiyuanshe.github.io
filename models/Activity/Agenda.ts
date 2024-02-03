import { observable } from 'mobx';
import {
  BiDataQueryOptions,
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
  | 'mentorOrganizations'
  | 'mentorPositions'
  | 'mentorSummaries'
  | 'startTime'
  | 'endTime'
  | 'approver'
  | 'score'
  | 'location'
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
  }

  client = larkClient;

  recommendList: Agenda[] = [];

  currentRecommend?: AgendaModel;

  requiredKeys = ['title', 'type', 'mentors', 'approver'] as const;

  sort = { startTime: 'ASC' } as const;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  @observable
  accessor group: Record<string, Agenda[]> = {};

  @observable
  accessor currentAuthorized = false;

  get authorization(): Record<string, boolean> | undefined {
    const { activityAgendaAuthorization } = globalThis.localStorage || {};

    return (
      activityAgendaAuthorization && JSON.parse(activityAgendaAuthorization)
    );
  }

  set authorization(data: Record<string, boolean>) {
    globalThis.localStorage?.setItem(
      'activityAgendaAuthorization',
      JSON.stringify(data),
    );
  }

  normalize({ id, fields }: TableRecord<Agenda>) {
    const {
      forum,
      mentors,
      mentorOrganizations,
      mentorPositions,
      mentorSummaries,
      score,
      tags,
      location,
      ...data
    } = fields;

    return {
      ...data,
      id: id!,
      forum: (forum as TableCellRelation[])?.map(normalizeText),
      mentors: (mentors as TableCellRelation[])
        ?.map(mentor => normalizeText(mentor).split(','))
        .flat(),
      mentorOrganizations:
        mentorOrganizations &&
        normalizeTextArray(mentorOrganizations as TableCellText[]),
      mentorPositions:
        mentorPositions &&
        normalizeTextArray(mentorPositions as TableCellText[]),
      mentorSummaries:
        mentorSummaries &&
        normalizeTextArray(mentorSummaries as TableCellText[]),
      score: typeof score === 'number' ? score : null,
      tags: (tags as string)?.trim().split(/\s+/),
      location: (location as TableCellRelation[])?.map(normalizeText),
    };
  }

  async getOne(id: string) {
    await super.getOne(id);

    const { mentors, tags, forum } = this.currentOne;

    this.currentRecommend = new SearchAgendaModel(this.appId, this.tableId);

    const list = await this.currentRecommend!.getList({ mentors, tags });

    this.recommendList = list.sort(({ forum: a }, { forum: b }) =>
      a === forum ? -1 : b === forum ? 1 : 0,
    );

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

    const { authorization } = this;

    if (authorization?.[title] != null)
      return (this.currentAuthorized = authorization[title]);

    const [matched] = await this.getList({ title, 负责人手机号: mobilePhone });

    this.authorization = { ...authorization, [title]: !!matched };

    return (this.currentAuthorized = !!matched);
  }
}

export class SearchAgendaModel extends AgendaModel {
  sort = { forum: 'ASC', startTime: 'ASC' } as const;

  makeFilter(filter: AgendaFilter) {
    return isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');
  }
}
