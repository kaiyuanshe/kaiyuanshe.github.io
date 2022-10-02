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

export type Cooperation = Record<
  'organization' | 'year' | 'level',
  TableCellValue
>;

export class OrganizationModel extends Stream<Organization>(ListModel) {
  client = client;
  baseURI = 'api/organization';

  @observable
  statistic: OrganizationStatistic = {} as OrganizationStatistic;

  normalizeLink(value: TableCellValue) {
    return value && typeof value === 'object' && 'link' in value
      ? value.text
      : value;
  }

  normalize = ({
    id,
    fields: { link, codeLink, email, ...fields },
  }: TableRecordList<Organization>['data']['items'][number]): Organization => ({
    ...fields,
    id: id!,
    link: this.normalizeLink(link),
    codeLink: this.normalizeLink(codeLink),
    email: this.normalizeLink(email),
  });

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

export const organizationStore = new OrganizationModel();
