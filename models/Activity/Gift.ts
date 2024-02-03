import { observable } from 'mobx';
import { BiDataQueryOptions, BiDataTable, TableCellValue } from 'mobx-lark';
import { groupBy } from 'web-utility';

import { larkClient } from '../Base';

export type Gift = Record<
  'name' | 'summary' | 'photo' | 'total' | 'score' | 'stock',
  TableCellValue
>;

export class GiftModel extends BiDataTable<Gift>() {
  client = larkClient;

  requiredKeys = ['name', 'photo', 'total', 'score'] as const;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  @observable
  accessor group: Record<number, Gift[]> = {};

  async getGroup() {
    return (this.group = groupBy(await this.getAll(), 'score'));
  }
}
