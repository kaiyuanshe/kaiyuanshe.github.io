import { CheckEvent, ListChunk } from '@kaiyuanshe/kys-service';
import { computed } from 'mobx';
import { Filter, ListModel } from 'mobx-restful';
import { buildURLData, groupBy } from 'web-utility';

import userStore from '../Base/User';

export class CheckEventModel extends ListModel<CheckEvent> {
  baseURI = 'event/check';
  client = userStore.client;

  @computed
  get group() {
    return groupBy(this.allItems, 'activityId');
  }

  async loadPage(
    pageIndex: number,
    pageSize: number,
    filter: Filter<CheckEvent>,
  ) {
    const { body } = await this.client.get<ListChunk<CheckEvent>>(
      `${this.baseURI}?${buildURLData({ pageIndex, pageSize, ...filter })}`,
    );
    return { pageData: body!.list, totalCount: body!.count };
  }

  async getUserCount({ activityId, agendaId }: Filter<CheckEvent>) {
    await userStore.restored;

    if (!userStore.session) return;

    try {
      const { length } = await this.getAll({
        user: userStore.session.id,
        activityId,
        agendaId,
      });
      return length;
    } catch {
      //
    }
  }

  async getHotActivity() {
    await userStore.restored;

    if (!userStore.session) return;

    try {
      const { body } = await this.client.get<ListChunk<CheckEvent>>(
        `${this.baseURI}/activity`,
      );

      return body!.list;
    } catch {
      //
    }
  }

  async getHotAgenda({ activityId }: Filter<CheckEvent>) {
    await userStore.restored;

    if (!userStore.session) return;

    try {
      const { body } = await this.client.get<ListChunk<CheckEvent>>(
        `${this.baseURI}/activity/${activityId}`,
      );

      return body!.list;
    } catch {
      //
    }
  }

  async getUserLikeActivity({ user }: Filter<CheckEvent>) {
    await userStore.restored;

    if (!userStore.session) return;

    try {
      const { body } = await this.client.get<ListChunk<CheckEvent>>(
        `${this.baseURI}/user/${user}`,
      );

      return body!.list;
    } catch {
      //
    }
  }
}
