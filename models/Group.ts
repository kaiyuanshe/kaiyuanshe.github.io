import { isEmpty } from 'lodash';
import {
  BiDataTable,
  makeSimpleFilter,
  normalizeText,
  TableCellLink,
  TableCellValue,
  TableRecordList,
} from 'mobx-lark';
import { NewData } from 'mobx-restful';

import { MAIN_BASE_ID } from '../pages/api/lark/core';
import { larkClient } from './Base';

export const GROUP_TABLE_ID = process.env.NEXT_PUBLIC_GROUP_TABLE_ID!;

export type Group = Record<
  | 'id'
  | 'name'
  | 'type'
  | 'fullName'
  | 'tags'
  | 'startDate'
  | 'leader'
  | 'members'
  | 'summary'
  | 'document'
  | 'email'
  | 'link'
  | 'codeLink'
  | 'logo',
  TableCellValue
>;

export class GroupModel extends BiDataTable<Group>() {
  client = larkClient;

  constructor(appId = MAIN_BASE_ID, tableId = GROUP_TABLE_ID) {
    super(appId, tableId);
  }

  requiredKeys = ['name', 'type', 'tags', 'leader'] as const;

  normalize({
    id,
    fields: { link, codeLink, email, ...fields },
  }: TableRecordList<Group>['data']['items'][number]) {
    return {
      ...fields,
      id: id!,
      link: normalizeText(link as TableCellLink),
      codeLink: normalizeText(codeLink as TableCellLink),
      email: normalizeText(email as TableCellLink),
    };
  }
}

export class SearchGroupModel extends GroupModel {
  makeFilter(filter: NewData<Group>) {
    return isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');
  }
}

export default new GroupModel();
