import { makeObservable, observable } from 'mobx';
import {
  BiDataTable,
  makeSimpleFilter,
  normalizeText,
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { Filter, NewData } from 'mobx-restful';
import { cache, countBy, groupBy, Hour, isEmpty } from 'web-utility';

import { larkClient } from '../Base';

export type AgendaFile = Record<
  'id' | 'summary' | 'agenda' | 'type' | 'file' | 'url' | 'remark' | 'approver',
  TableCellValue
>;

export const KCC_BASE_ID = 'A24bb4YskaQmF4sRyAOcJacUnbb';
export const COMMUNITY_TABLE_ID = 'tblUOAb6Q1r0WR8s';

export class AgendaFileModel extends BiDataTable<AgendaFile>() {
  client = larkClient;

  constructor(appId = KCC_BASE_ID, tableId = COMMUNITY_TABLE_ID) {
    super(appId, tableId);

    makeObservable(this);
  }

  requiredKeys = ['summary'] as const;

  sort = { summary: 'ASC' } as const;

  @observable
  group: Record<string, AgendaFile[]> = {};

  normalize({
    id,
    fields: { agenda, approver, ...fields },
  }: TableRecord<AgendaFile>) {
    return {
      ...fields,
      id: id!,
      agenda: (agenda as TableCellRelation[])?.map(normalizeText)[0],
      approver: (approver as TableCellRelation[])?.map(normalizeText)[0],
    };
  }
}
