import { observable } from 'mobx';
import { NewData, ListModel, Stream, toggle } from 'mobx-restful';
import { TableCellValue } from 'lark-ts-sdk';
import { createListStream } from './Lark';
import { client } from './Base';
import { ActivityStatistic } from '../pages/api/activity/statistic';

export type Activity = Record<
  | 'id'
  | 'name'
  | 'startTime'
  | 'endTime'
  | 'city'
  | 'location'
  | 'organizers'
  | 'link'
  | 'image',
  TableCellValue
>;

export class ActivityModel extends Stream<Activity>(ListModel) {
  client = client;
  baseURI = 'activity';

  @observable
  statistic: ActivityStatistic = {} as ActivityStatistic;

  normalize = ({
    id,
    fields,
  }: {
    id?: TableCellValue;
    fields: Activity;
  }): Activity => ({
    ...fields,
    id: id!,
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
