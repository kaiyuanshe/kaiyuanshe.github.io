import { makeObservable, observable } from 'mobx';
import {
  BiDataTable,
  makeSimpleFilter,
  normalizeText,
  TableCellAttachment,
  TableCellMedia,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { NewData } from 'mobx-restful';
import { groupBy, isEmpty, TimeData } from 'web-utility';

import { larkClient } from '../Base';
import { HR_BASE_ID } from './Person';

export type Personnel = Record<
  | 'id'
  | 'createdAt'
  | 'type'
  | 'applicants'
  | 'recipient'
  | 'recipientAvatar'
  | 'department'
  | 'position'
  | 'award'
  | 'reason'
  | 'contribution'
  | 'proposition'
  | 'recommenders'
  | `recommendation${1 | 2}`
  | 'approvers'
  | 'rejecters'
  | 'passed',
  TableCellValue
>;

export const PERSONNEL_TABLE_ID = process.env.NEXT_PUBLIC_PERSONNEL_TABLE_ID!;

export type ElectionTarget = '理事' | '正式成员';

export class PersonnelModel extends BiDataTable<Personnel>() {
  client = larkClient;

  constructor(appId = HR_BASE_ID, tableId = PERSONNEL_TABLE_ID) {
    super(appId, tableId);

    makeObservable(this);
  }

  requiredKeys = ['recipient'] as const;

  sort = { createdAt: 'DESC' } as const;

  @observable
  group: Record<string, Personnel[]> = {};

  currentYear?: number;

  makeFilter({ position, passed, ...filter }: NewData<Personnel>) {
    const { currentYear } = this;

    return [
      currentYear && `CurrentValue.[createdAt]>=TODATE("${currentYear}-01-01")`,
      currentYear && `CurrentValue.[createdAt]<=TODATE("${currentYear}-12-31")`,
      position && makeSimpleFilter({ position }, '=', 'OR'),
      passed && `CurrentValue.[passed]=${passed}`,
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
      recipientAvatar,
      department,
      position,
      award,
      recommenders,
      approvers,
      rejecters,
      passed,
      ...fields
    },
  }: TableRecord<Personnel>) {
    return {
      ...fields,
      id: id!,
      applicants: (applicants as TableCellRelation[])?.map(normalizeText),
      recipient: (recipient as TableCellRelation[])?.map(normalizeText)[0],
      recipientAvatar: (recipientAvatar as TableCellAttachment[])?.map(
        ({ attachmentToken, ...file }) =>
          ({
            ...file,
            file_token: attachmentToken,
          }) as unknown as TableCellMedia,
      ),
      department: (department as TableCellRelation[])?.map(normalizeText)[0],
      position: (position as TableCellRelation[])?.map(normalizeText)[0],
      award: (award as TableCellRelation[])?.map(normalizeText)[0],
      recommenders: (recommenders as TableCellRelation[])?.map(normalizeText),
      approvers: (approvers as TableCellText[])
        ?.map(normalizeText)
        .toString()
        .split(','),
      rejecters: (rejecters as TableCellText[])
        ?.map(normalizeText)
        .toString()
        .split(','),
      passed: JSON.parse(normalizeText((passed as TableCellText[])[0])),
    };
  }

  async getGroup(
    filter: Partial<NewData<Personnel>> = {},
    groupKeys: (keyof Personnel)[] = [],
    year?: number,
  ) {
    this.currentYear = year;

    try {
      return (this.group = groupBy(await this.getAll(filter), data => {
        for (const key of groupKeys)
          if (data[key] != null) return data[key] as string;

        return '';
      }));
    } finally {
      this.currentYear = undefined;
    }
  }

  async getYearGroup(
    filter: Partial<NewData<Personnel>>,
    groupKeys: (keyof Personnel)[],
  ) {
    return (this.group = groupBy(await this.getAll(filter), data => {
      for (const key of groupKeys)
        if (data[key] != null)
          return new Date(data[key] as TimeData).getFullYear();

      return 0;
    }));
  }
}
