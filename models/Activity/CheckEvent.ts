import { CheckEvent, ListChunk } from '@kaiyuanshe/kys-service';
import { Filter, ListModel } from 'mobx-restful';
import { buildURLData } from 'web-utility';

import userStore from '../Base/User';

export class CheckEventModel extends ListModel<CheckEvent> {
  baseURI = 'event/check';
  client = userStore.client;

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

  getList(filter: Filter<CheckEvent>, pageIndex: number, pageSize: number) {
    this.baseURI = 'event/check/session';

    return super.getList(filter, pageIndex, pageSize);
  }
}
