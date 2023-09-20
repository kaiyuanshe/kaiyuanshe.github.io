import { makeObservable, observable } from 'mobx';
import {
  BiDataTable,
  normalizeText,
  TableCellMedia,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { larkClient } from '../Base';

export type AgendaFile = Record<
  'id' | 'summary' | 'agenda' | 'type' | 'url' | 'remark' | 'approver',
  TableCellValue
> & {
  file: TableCellMedia[];
};

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
