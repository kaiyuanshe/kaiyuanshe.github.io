import { makeObservable, observable } from 'mobx';
import { BiDataTable, TableCellValue, TableRecord } from 'mobx-lark';
import { groupBy } from 'web-utility';

import { larkClient } from '../Base';

export type Staff = {
  id: TableCellValue;
  name: TableCellValue;
  volunteerType: TableCellValue;
  avatar: TableCellValue;
  
  role: TableCellValue[]; 
}

type StaffFilter = {
  [k in keyof Staff]?: string | number;
};

export class StaffModel extends BiDataTable<Staff>() {
  constructor(appId: string, tableId: string) {
    super(appId, tableId);

    makeObservable(this);
  }

  client = larkClient;

  requiredKeys = ['name'] as const;

  @observable
  group: Record<string, Staff[]> = {};

  async getGroup(filter: StaffFilter) {
    return (this.group = groupBy(
      await this.getAll(filter),
      ({ volunteerType }) => volunteerType + '',
    ));
  }
}
