import { makeObservable, observable } from 'mobx';
import { BiDataTable, TableCellValue } from 'mobx-lark';

import { larkClient } from '../Base';

export type Staff = Record<'id' | 'name', TableCellValue>;

export class StaffModel extends BiDataTable<Staff>() {
  constructor(appId: string, tableId: string) {
    super(appId, tableId);

    makeObservable(this);
  }

  client = larkClient;

  requiredKeys = ['name'] as const;

  @observable
  group: Record<string, Staff[]> = {};
}
