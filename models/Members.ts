import { NewData, ListModel, Stream } from 'mobx-restful';
import { TableCellLink, TableCellValue, TableRecordList } from 'lark-ts-sdk';

import { client } from './Base';
import { normalizeText, createListStream } from './Lark';

export type Member = Record<
  | 'id'
  | 'name'
  | 'nickname'
  | 'organization'
  | 'department'
  | 'project'
  | 'GitHubID',
  TableCellValue
>;

export class MembersModel extends Stream<Member>(ListModel) {
  client = client;
  baseURI = 'members';

  normalize = ({
    id,
    fields: { GitHubID, ...fields },
  }: TableRecordList<Member>['data']['items'][number]): Member => ({
    ...fields,
    id: id!,
    GitHubID: normalizeText(GitHubID as TableCellLink) as string,
  });

  async *openStream(filter: NewData<Member>) {
    for await (const { total, items } of createListStream<Member>(
      this.client,
      this.baseURI,
      filter,
    )) {
      this.totalCount = total;
      yield* items?.map(this.normalize) || [];
    }
  }
}

export default new MembersModel();
