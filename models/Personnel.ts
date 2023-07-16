import {
  BiDataTable,
  makeSimpleFilter,
  normalizeText,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecordList,
} from 'mobx-lark';
import { NewData } from 'mobx-restful';
import { isEmpty } from 'web-utility';

import { larkClient } from './Base';
import { HR_BASE_ID } from './Person';

export type Personnel = Record<
  | 'id'
  | 'createdAt'
  | 'type'
  | 'applicants'
  | 'recipient'
  | 'department'
  | 'position'
  | 'award'
  | 'reason'
  | 'passed',
  TableCellValue
>;

export const PERSONNEL_TABLE_ID = process.env.NEXT_PUBLIC_PERSONNEL_TABLE_ID!;

export class PersonnelModel extends BiDataTable<Personnel>() {
  client = larkClient;

  constructor(appId = HR_BASE_ID, tableId = PERSONNEL_TABLE_ID) {
    super(appId, tableId);
  }

  requiredKeys = ['recipient'] as const;

  sort = { createdAt: 'DESC' } as const;

  makeFilter(filter: NewData<Personnel>) {
    return [
      'CurrentValue.[passed]=true',
      !isEmpty(filter) && makeSimpleFilter(filter),
    ]
      .filter(Boolean)
      .join('&&');
  }

  normalize({
    id,
    fields: {
      applicants,
      recipient,
      department,
      position,
      award,
      passed,
      ...fields
    },
  }: TableRecordList<Personnel>['data']['items'][number]) {
    return {
      ...fields,
      id: id!,
      applicants: (applicants as TableCellRelation[])?.map(normalizeText),
      recipient: (recipient as TableCellRelation[])?.map(normalizeText),
      department: (department as TableCellRelation[])?.map(normalizeText),
      position: (position as TableCellRelation[])?.map(normalizeText),
      award: (award as TableCellRelation[])?.map(normalizeText),
      passed: JSON.parse(normalizeText((passed as TableCellText[])[0])),
    };
  }
}
