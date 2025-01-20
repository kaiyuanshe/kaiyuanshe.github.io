import { VoteTicket } from '@kaiyuanshe/kys-service';
import { BaseModel, toggle } from 'mobx-restful';

import userStore from '../Base/User';

export class ElectionModel extends BaseModel {
  client = userStore.client;

  @toggle('uploading')
  async createVoteTicket(electionName: string) {
    const { body } = await this.client.post<VoteTicket>(
      `election/${electionName}/vote/ticket`,
    );
    return body!;
  }
}
