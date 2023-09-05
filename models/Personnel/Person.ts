import {
  BiDataTable,
  makeSimpleFilter,
  TableCellLink,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { NewData } from 'mobx-restful';
import { isEmpty } from 'web-utility';

import { larkClient } from '../Base';

export type Person = Record<
  | 'id'
  | 'name'
  | 'gender'
  | 'avatar'
  | 'city'
  | 'mobilePhone'
  | 'email'
  | 'website'
  | 'github'
  | 'skills'
  | 'summary',
  TableCellValue
>;

export const HR_BASE_ID = process.env.NEXT_PUBLIC_HR_BASE_ID!,
  PERSON_TABLE_ID = process.env.NEXT_PUBLIC_PERSON_TABLE_ID!;

export class PersonModel extends BiDataTable<Person>() {
  client = larkClient;

  constructor(appId = HR_BASE_ID, tableId = PERSON_TABLE_ID) {
    super(appId, tableId);
  }

  normalize({
    id,
    fields: { email, website, github, ...fields },
  }: TableRecord<Person>) {
    return {
      ...fields,
      id: id!,
      email: (email as TableCellLink)?.link,
      website: (website as TableCellLink)?.link,
      github: (github as TableCellLink)?.link,
    };
  }
}

export class SearchPersonModel extends PersonModel {
  makeFilter(filter: NewData<Person>) {
    return isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');
  }
}
