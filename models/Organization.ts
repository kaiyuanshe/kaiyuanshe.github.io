import { observable } from 'mobx';
import { NewData, ListModel, Stream, toggle } from 'mobx-restful';
import { TableCellValue, TableRecordList } from 'lark-ts-sdk';

import { client } from './Base';
import { createListStream } from './Lark';
import { OrganizationStatistic } from '../pages/api/organization/statistic';

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

  @observable
  statistic: OrganizationStatistic = {} as OrganizationStatistic;

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

  @toggle('downloading')
  async getStatistic() {
    const { body } = await this.client.get<OrganizationStatistic>(
      `${this.baseURI}/statistic`,
    );
    return (this.statistic = body!);
  }
}

export default new OrganizationModel();
