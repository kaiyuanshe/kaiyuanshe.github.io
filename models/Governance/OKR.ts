import {
  BiDataTable,
  makeSimpleFilter,
  normalizeText,
  normalizeTextArray,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { NewData } from 'mobx-restful';
import { isEmpty } from 'web-utility';

import { larkClient } from '../Base';

export const GOVERNANCE_BASE_ID = process.env.NEXT_PUBLIC_GOVERNANCE_BASE_ID!,
  OKR_TABLE_ID = process.env.NEXT_PUBLIC_OKR_TABLE_ID!;

export type OKR = Record<
  | 'id'
  | `created${'At' | 'By'}`
  | 'year'
  | 'department'
  | 'object'
  | `${'first' | 'second' | 'third'}Result`
  | `planQ${1 | 2 | 3 | 4}`
  | 'budget',
  TableCellValue
>;

export class OKRModel extends BiDataTable<OKR>() {
  client = larkClient;

  constructor(appId = GOVERNANCE_BASE_ID, tableId = OKR_TABLE_ID) {
    super(appId, tableId);
  }

  makeFilter({ year, ...filter }: Partial<NewData<OKR>>) {
    return [
      `CurrentValue.[year]=${year}`,
      !isEmpty(filter) && makeSimpleFilter(filter),
    ]
      .filter(Boolean)
      .join('&&');
  }

  extractFields({
    fields: {
      department,
      object,
      firstResult,
      secondResult,
      thirdResult,
      planQ1,
      planQ2,
      planQ3,
      planQ4,
      ...fields
    },
    ...meta
  }: TableRecord<OKR>) {
    return {
      ...meta,
      ...fields,
      department: (department as TableCellRelation[])?.map(normalizeText),
      object: object && normalizeTextArray(object as TableCellText[]),
      firstResult:
        firstResult && normalizeTextArray(firstResult as TableCellText[]),
      secondResult:
        secondResult && normalizeTextArray(secondResult as TableCellText[]),
      thirdResult:
        thirdResult && normalizeTextArray(thirdResult as TableCellText[]),
      planQ1: planQ1 && normalizeTextArray(planQ1 as TableCellText[]),
      planQ2: planQ2 && normalizeTextArray(planQ2 as TableCellText[]),
      planQ3: planQ3 && normalizeTextArray(planQ3 as TableCellText[]),
      planQ4: planQ4 && normalizeTextArray(planQ4 as TableCellText[]),
    };
  }
}
