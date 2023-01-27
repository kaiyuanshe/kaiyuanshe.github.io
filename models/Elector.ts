import { observable } from 'mobx';
import {
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellValue,
  TableRecordList,
} from 'mobx-lark';
import { NewData } from 'mobx-restful';
import { groupBy } from 'web-utility';
import { larkClient } from './Base';

export const ELECTION_BASE_ID = process.env.NEXT_PUBLIC_ELECTION_BASE_ID!,
  ELECTION_TABLE_ID = process.env.NEXT_PUBLIC_ELECTION_TABLE_ID!;

export type ElectionTarget = '理事' | '正式成员';

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
  | 'lastWorkGroupSummary'
  | 'lastProjectGroup'
  | 'lastProjectGroupSummary'
  | 'electionTarget'
  | 'nextTermPlan'
  | 'councilPositiveVoteCount'
  | 'councilNegativeVoteCount'
  | 'regularPositiveVoteCount'
  | 'regularNegativeVoteCount'
  | 'councilVoteCount'
  | 'regularVoteCount',
  TableCellValue
>;

export class ElectorModel extends BiDataTable<Elector>() {
  client = larkClient;

  constructor(appId = ELECTION_BASE_ID, tableId = ELECTION_TABLE_ID) {
    super(appId, tableId);
  }

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
      'CurrentValue.[lastSummary]!=""',
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
