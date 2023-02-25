import { isEmpty } from 'web-utility';
import {
  BiDataTable,
  makeSimpleFilter,
  normalizeText,
  TableCellLink,
  TableCellValue,
  TableRecordList,
} from 'mobx-lark';
import { NewData } from 'mobx-restful';

import { MemberTabsProps } from '../components/Member/Tabs';
import { MAIN_BASE_ID } from '../pages/api/lark/core';
import { larkClient } from './Base';

export const MEMBER_TABLE_ID = process.env.NEXT_PUBLIC_MEMBER_TABLE_ID!;

export type Member = Record<
  | 'id'
  | 'name'
  | 'nickname'
  | 'organization'
  | 'department'
  | 'project'
  | 'GitHubID'
  | 'post',
  TableCellValue
>;

export type MembersGroup = Record<string, Record<string, MemberTabsProps>>;

export type IndexKey = number | string | symbol;

export type GroupMap<T> = Record<IndexKey, Record<IndexKey, T[] | {}>>;

type GroupAllMap<T> = Record<
  IndexKey,
  { count: number; groupMap: GroupMap<T> }
>;

function groupFn<T>(groupMap: GroupMap<T>, groupKeys: string[], groupItem: T) {
  for (const key of groupKeys || [])
    ((groupMap[key] ||= { list: [] }).list as T[]).push(groupItem);
}

export function groupBys<T extends Record<IndexKey, any>>(
  items: T[],
  byKeys: string[],
): {
  grouped: GroupAllMap<T>;
  unGrouped: T[];
} {
  const groupAllMap: GroupAllMap<T> = {};
  const otherGroup: T[] = [];

  for (const item of items) {
    let hasGroup: boolean = false;
    for (const byKey of byKeys) {
      groupFn<T>(
        (groupAllMap[byKey] ||= { count: 0, groupMap: {} }).groupMap,
        item[byKey],
        item,
      );
      if (item[byKey]) {
        groupAllMap[byKey].count++;
        hasGroup = true;
      }
    }
    if (!hasGroup) otherGroup.push(item);
  }
  return { grouped: groupAllMap, unGrouped: otherGroup };
}

export class MemberModel extends BiDataTable<Member>() {
  client = larkClient;

  constructor(appId = MAIN_BASE_ID, tableId = MEMBER_TABLE_ID) {
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
      'department',
      'project',
    ]);
    const groupMap: GroupMap<Member> = Object.assign(
      {
        理事会: {},
        顾问委员会: {},
        法律咨询委员会: {},
        执行委员会: {},
        项目委员会: {},
      },
      groupData.grouped['organization'].groupMap,
    );
    groupMap['项目委员会'].tabs = groupData.grouped['project'].groupMap;
    groupMap['项目委员会'].count = groupData.grouped['project'].count;
    groupMap['执行委员会'].tabs = groupData.grouped['department'].groupMap;
    groupMap['执行委员会'].count = groupData.grouped['department'].count;

    try {
      delete  groupMap["顾问委员会"];
      delete  groupMap["法律咨询委员会"];
    } catch (_) {}

    return {
      groupMap,
      otherGroupList: groupData.unGrouped,
    };
  }
}

export class SearchMemberModel extends MemberModel {
  makeFilter(filter: NewData<Member>) {
    return isEmpty(filter)
      ? undefined
      : makeSimpleFilter(filter, 'contains', 'OR');
  }
}
