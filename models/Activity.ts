import { observable } from 'mobx';
import { NewData, ListModel, Stream, toggle } from 'mobx-restful';
import { TableCellLink, TableRecordList } from 'lark-ts-sdk';
import { createListStream, normalizeText } from './Lark';
import { client } from './Base';
import { Activity } from '../pages/api/activity';
import { ActivityStatistic } from '../pages/api/activity/statistic';

export class ActivityModel extends Stream<Activity>(ListModel) {
  client = client;
  baseURI = 'activity';

  @observable
  statistic: ActivityStatistic = {} as ActivityStatistic;

  normalize = ({ 
    id, 
    fields: { link, ...fields }, 
  }: TableRecordList<Activity>['data']['items'][number]): Activity => ({ 
    ...fields, 
    id: id!, 
    link: normalizeText(link as TableCellLink) || null, 
  }); 

  async *openStream(filter: NewData<Activity>) {
    for await (const { total, items } of createListStream<Activity>(
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
    const { body } = await this.client.get<ActivityStatistic>(
      `${this.baseURI}/statistic`,
    );
    return (this.statistic = body!);
  }
}

export default new ActivityModel();
