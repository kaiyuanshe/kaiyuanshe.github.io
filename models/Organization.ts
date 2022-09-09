import { NewData, ListModel, Stream } from 'mobx-restful';
import { TableCellValue, TableRecordList } from 'lark-ts-sdk';

import { client } from './Base';
import { createListStream } from './Lark';

export type Organization = Record<
  | 'id'
  | 'verified'
  | 'name'
  | 'type'
  | 'tags'
  | 'startDate'
  | 'city'
  | 'email'
  | 'link'
  | 'codeLink'
  | 'wechatName'
  | 'logos'
  | 'summary',
  TableCellValue
>;

export class OrganizationModel extends Stream<Organization>(ListModel) {
  client = client;
  baseURI = 'api/organization';

  normalize({
    id,
    fields,
  }: TableRecordList<Organization>['data']['items'][number]): Organization {
    return { ...fields, id: id! };
  }

  async *openStream(filter: NewData<Organization>) {
    for await (const { total, items } of createListStream<Organization>(
      this.client,
      this.baseURI,
      filter,
    )) {
      this.totalCount = total;

      yield* items?.map(this.normalize) || [];
    }
  }
}

export default new OrganizationModel();
