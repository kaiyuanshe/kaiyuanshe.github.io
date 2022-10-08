import { observable } from 'mobx';
import { ListModel, Stream, toggle } from 'mobx-restful';
import { TableCellValue } from 'lark-ts-sdk';

import { client } from './Base';
import { ActivityStatistic } from '../pages/api/activity/statistic';

export type Activity = Record<
  'name' | 'startTime' | 'endTime' | 'city' | 'location' | 'organizers',
  TableCellValue
>;

export class ActivityModel extends Stream<Activity>(ListModel) {
  client = client;
  baseURI = 'activity';

  @observable
  statistic: ActivityStatistic = {} as ActivityStatistic;

  @toggle('downloading')
  async getStatistic() {
    const { body } = await this.client.get<ActivityStatistic>(
      `${this.baseURI}/statistic`,
    );
    return (this.statistic = body!);
  }
}

export default new ActivityModel();
