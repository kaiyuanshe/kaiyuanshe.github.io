import {
  TableCellRelation,
  TableCellValue,
  TableRecordList,
} from 'lark-ts-sdk';
import { observable } from 'mobx';
import { ListModel, NewData } from 'mobx-restful';
import { groupBy } from 'web-utility';

import { BiTable, normalizeText } from './Lark';

export const ELECTION_BASE_ID = process.env.NEXT_PUBLIC_ELECTION_BASE_ID!,
  ELECTION_TABLE_ID = process.env.NEXT_PUBLIC_ELECTION_TABLE_ID!;

export type Elector = Record<
  | 'id'
  | 'createdAt'
  | 'name'
  | 'gender'
  | 'photo'
  | 'lastLevel'
  | 'lastCommittee'
  | 'lastCommitteeSummary'
  | 'lastWorkGroup'
  | 'lastProjectGroup'
  | 'electionTarget',
  TableCellValue
>;

export class ElectorModel extends BiTable<Elector>(ListModel) {
  @observable
  group: Record<string, Elector[]> = {};

  currentYear = new Date().getFullYear();

  normalize({
    id,
    fields: { lastCommittee, lastWorkGroup, lastProjectGroup, ...data },
  }: TableRecordList<Elector>['data']['items'][number]) {
    return {
      ...data,
      id: id!,
      lastCommittee:
        (lastCommittee &&
          normalizeText((lastCommittee as TableCellRelation[])[0])?.split(
            ',',
          )) ||
        null,
      lastWorkGroup:
        (lastWorkGroup &&
          normalizeText((lastWorkGroup as TableCellRelation[])[0])?.split(
            ',',
          )) ||
        null,
      lastProjectGroup:
        (lastProjectGroup &&
          normalizeText((lastProjectGroup as TableCellRelation[])[0])?.split(
            ',',
          )) ||
        null,
    };
  }

  makeFilter(filter: NewData<Elector>) {
    const { currentYear } = this;

    return [
      'NOT(CurrentValue.[lastSummary]="")',
      `CurrentValue.[createdAt]>=TODATE("${currentYear}-01-01")`,
      `CurrentValue.[createdAt]<TODATE("${currentYear + 1}-01-01")`,
    ].join('&&');
  }

  async getGroup(year = this.currentYear) {
    this.currentYear = year;

    return (this.group = groupBy(
      await this.getAll(),
      ({ electionTarget }) => electionTarget + '',
    ));
  }
}

export default new ElectorModel(ELECTION_BASE_ID, ELECTION_TABLE_ID);
