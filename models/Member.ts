import { NewData, ListModel, Stream } from 'mobx-restful';
import { TableCellLink, TableCellValue, TableRecordList } from 'lark-ts-sdk';

import { client } from './Base';
import { normalizeText, createListStream } from './Lark';
import { MemberTabsProps } from '../components/Member/Tabs';

export type Member = Record<
  | 'id'
  | 'name'
  | 'nickname'
  | 'organization'
  | 'department'
  | 'project'
  | 'GitHubID',
  TableCellValue
>;

export type MembersGroup = Record<string, Record<string, MemberTabsProps>>;

export type IndexKey = number | string | symbol;

type GroupMap<T> = Record<IndexKey, Record<IndexKey, T[] | {}>>;

type GroupAllMap<T> = Record<
  IndexKey,
  { count: number; groupMap: GroupMap<T> }
>;

function groupFn<T>(
  groupMap: GroupMap<T>,
  groupKeys: string[],
  groupItem: T,
) {
  for (const key of groupKeys || [])
    ((groupMap[key] = groupMap[key] || { list: [] }).list as T[]).push(
      groupItem,
    );
};

function groupBys<T extends Record<IndexKey, any>>(
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
        (hasGroup = true)
      }
    }
    if (!hasGroup) otherGroup.push(item);
  }
  return { grouped: groupAllMap, unGrouped: otherGroup };
};

export class MemberModel extends Stream<Member>(ListModel) {
  client = client;
  baseURI = 'members';

  normalize = ({
    id,
    fields: { GitHubID, ...fields },
  }: TableRecordList<Member>['data']['items'][number]): Member => ({
    ...fields,
    id: id!,
    GitHubID: normalizeText(GitHubID as TableCellLink) as string,
  });

  async *openStream(filter: NewData<Member>) {
    for await (const { total, items } of createListStream<Member>(
      this.client,
      this.baseURI,
      filter,
    )) {
      this.totalCount = total;

      yield* items?.map(this.normalize) || [];
    }
  }

  async getStatic() {
    const list = await this.getList({}, 1, 300);
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

    return {
      groupMap,
      otherGroupList: groupData.unGrouped,
    };
  }
}

export default new MemberModel();
