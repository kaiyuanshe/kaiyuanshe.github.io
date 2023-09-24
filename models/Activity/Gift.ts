import { makeObservable, observable } from 'mobx';
import { BiDataTable, TableCellValue } from 'mobx-lark';
import { groupBy } from 'web-utility';

import { larkClient } from '../Base';

export type Gift = Record<
  'name' | 'summary' | 'photo' | 'total' | 'score' | 'stock',
  TableCellValue
>;

export class GiftModel extends BiDataTable<Gift>() {
  client = larkClient;

  constructor(appId: string, tableId: string) {
    super(appId, tableId);

    makeObservable(this);
  }

  requiredKeys = ['name', 'photo', 'total', 'score'] as const;

  @observable
  group: Record<number, Gift[]> = {};

  async getGroup() {
    return (this.group = groupBy(await this.getAll(), 'score'));
  }
}
