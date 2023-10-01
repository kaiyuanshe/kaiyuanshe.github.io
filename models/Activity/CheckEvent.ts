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

  async getUserScore({ activityId, agendaId }: Filter<CheckEvent>) {
    try {
      const { length } = await this.getAll({
        user: userStore.session?.id,
        activityId,
        agendaId,
      });
      return length;
    } catch {}
  }
}
