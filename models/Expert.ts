import { isEmpty } from 'web-utility';
import {
  BiDataTable,
  makeSimpleFilter,
  normalizeText,
  TableCellLink,
  TableRecordList,
} from 'mobx-lark';
import { NewData } from 'mobx-restful';

import { MAIN_BASE_ID } from '../pages/api/lark/core';
import { larkClient } from './Base';
import { groupBys, GroupMap, Member } from './Member';

export const EXPERT_TABLE_ID = process.env.NEXT_PUBLIC_EXPERT_TABLE_ID!;

// const _List= process.env.NEXT_PUBLIC_EXPERT_TABLE_ID!;

export class ExpertModel extends BiDataTable<Member>() {
  client = larkClient;

  constructor(appId = MAIN_BASE_ID, tableId = EXPERT_TABLE_ID) {
    super(appId, tableId);
  }

  normalize({
    id,
    fields: { GitHubID,post, ...fields },
  }: TableRecordList<Member>['data']['items'][number]) {
    return {
      ...fields,
      id: id!,
      post: normalizeText(post as TableCellLink),
      GitHubID: normalizeText(GitHubID as TableCellLink),
    };
  }

  async getStatic() {
    const list = await this.getAll();
    this.clear();
    const groupData = groupBys<Member>(list, [
      'organization',
    ]);
    const groupMap: GroupMap<Member> = Object.assign(
      {
        顾问委员会: {},
        法律咨询委员会: {},
      },
      {},
    );
    groupMap['顾问委员会'] = groupData.grouped['organization'].groupMap['顾问委员会']
    groupMap['法律咨询委员会'] = groupData.grouped['organization'].groupMap['法律咨询委员会']
    return {
      groupMap,
      otherGroupList: groupData.unGrouped,
    };
  }
}

export class SearchExpertModel extends ExpertModel {
  makeFilter(filter: NewData<Member>) {
    return isEmpty(filter)
      ? undefined
      : makeSimpleFilter(filter, 'contains', 'OR');
  }
}
