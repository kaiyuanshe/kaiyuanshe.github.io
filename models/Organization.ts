import { observable } from 'mobx';
import { NewData, ListModel, Stream, toggle } from 'mobx-restful';
import {
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecordList,
} from 'lark-ts-sdk';

import { client } from './Base';
import { createListStream } from './Lark';
import { OrganizationStatistic } from '../pages/api/organization/statistic';
import { CooperationData } from '../pages/api/organization/cooperation';

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
  'organization' | 'year' | 'level' | 'link',
  TableCellValue
>;

export class OrganizationModel extends Stream<Organization>(ListModel) {
  client = client;
  baseURI = 'organization';

  @observable
  statistic: OrganizationStatistic = {} as OrganizationStatistic;

  @observable
  cooperation: CooperationData = {} as CooperationData;

  normalizeText = (value: TableCellLink | TableCellRelation) =>
    value && typeof value === 'object' && 'text' in value ? value.text : value;

  normalize = ({
    id,
    fields: { link, codeLink, email, ...fields },
  }: TableRecordList<Organization>['data']['items'][number]): Organization => ({
    ...fields,
    id: id!,
    link: this.normalizeText(link as TableCellLink),
    codeLink: this.normalizeText(codeLink as TableCellLink),
    email: this.normalizeText(email as TableCellLink),
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

  @toggle('downloading')
  async getCooperation() {
    const { body } = await this.client.get<CooperationData>(
      `${this.baseURI}/cooperation`,
    );
    const group = Object.fromEntries(
      Object.entries(body!).map(([year, list]) => [
        year,
        list.map(({ organization, link, ...item }) => ({
          ...item,
          organization: (organization as TableCellRelation[]).map(
            this.normalizeText,
          ),
          link: (link as TableCellLink[]).map(this.normalizeText),
        })),
      ]),
    );
    return (this.cooperation = group);
  }
}

export default new OrganizationModel();
