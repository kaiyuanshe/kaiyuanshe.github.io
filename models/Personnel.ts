import { observable } from 'mobx';
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
import { groupBy, isEmpty } from 'web-utility';

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
  | 'approvers'
  | 'rejecters'
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

  @observable
  group: Record<string, Personnel[]> = {};

  currentYear?: number;

  makeFilter({ passed, ...filter }: NewData<Personnel>) {
    const { currentYear } = this;

    return [
      passed && `CurrentValue.[passed]=${passed}`,
      currentYear && `CurrentValue.[createdAt]>=TODATE("${currentYear}-01-01")`,
      currentYear && `CurrentValue.[createdAt]<=TODATE("${currentYear}-12-31")`,
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

  async getGroup(year = this.currentYear) {
    this.currentYear = year;

    try {
      return (this.group = groupBy(
        await this.getAll(),
        ({ position, award }) => (position || award) as string,
      ));
    } finally {
      this.currentYear = undefined;
    }
  }
}
