import { NewData, ListModel, Stream } from 'mobx-restful';
import { TableCellLink, TableCellValue, TableRecordList } from 'lark-ts-sdk';

import { client } from './Base';
import { normalizeText, createListStream } from './Lark';

export type Group = Record<
  | 'id'
  | 'name'
  | 'type'
  | 'fullName'
  | 'tags'
  | 'startDate'
  | 'leader'
  | 'members'
  | 'summary'
  | 'document'
  | 'email'
  | 'link'
  | 'codeLink'
  | 'logo',
  TableCellValue
>;

export class GroupModel extends Stream<Group>(ListModel) {
  client = client;
  baseURI = 'group';

  normalize = ({
    id,
    fields: { link, codeLink, email, ...fields },
  }: TableRecordList<Group>['data']['items'][number]): Group => ({
    ...fields,
    id: id!,
    link: normalizeText(link as TableCellLink),
    codeLink: normalizeText(codeLink as TableCellLink),
    email: normalizeText(email as TableCellLink),
  });

  async *openStream(filter: NewData<Group>) {
    for await (const { total, items } of createListStream<Group>(
      this.client,
      this.baseURI,
      filter,
    )) {
      this.totalCount = total;

      yield* items?.map(this.normalize) || [];
    }
  }
}

export default new GroupModel();
