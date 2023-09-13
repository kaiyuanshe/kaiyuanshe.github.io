import { makeObservable, observable } from 'mobx';
import {
  BiDataTable,
  makeSimpleFilter,
  TableCellLink,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { NewData } from 'mobx-restful';
import { groupBy, isEmpty, TimeData } from 'web-utility';

import { larkClient } from '../Base';

export type Community = Record<
  | 'id'
  | 'name'
  | 'Person'
  | 'logo'
  | 'director'
  | 'startDate'
  | 'summary'
  | 'link'
  | 'Activity',
  TableCellValue
>;

export const KCC_BASE_ID = process.env.NEXT_PUBLIC_KCC_BASE_ID!;
export const COMMUNITY_TABLE_ID = process.env.NEXT_PUBLIC_COMMUNITY_TABLE_ID!;

export type ElectionTarget = '理事' | '正式成员';

export class CommunityModel extends BiDataTable<Community>() {
  client = larkClient;

  constructor(appId = KCC_BASE_ID, tableId = COMMUNITY_TABLE_ID) {
    super(appId, tableId);

    makeObservable(this);
  }

  requiredKeys = ['name'] as const;

  sort = { name: 'ASC' } as const;

  @observable
  group: Record<string, Community[]> = {};

  currentYear?: number;

  makeFilter({ ...filter }: NewData<Community>) {
    const { currentYear } = this;

    return [
      currentYear && `CurrentValue.[createdAt]>=TODATE("${currentYear}-01-01")`,
      currentYear && `CurrentValue.[createdAt]<=TODATE("${currentYear}-12-31")`,
      !isEmpty(filter) && makeSimpleFilter(filter),
    ]
      .filter(Boolean)
      .join('&&');
  }

  normalize({ id, fields: { link, ...fields } }: TableRecord<Community>) {
    return {
      ...fields,
      id: id!,
      link: (link as TableCellLink)?.link,
    };
  }
}
