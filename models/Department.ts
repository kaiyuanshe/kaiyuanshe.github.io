import { computed } from 'mobx';
import {
  BiDataTable,
  normalizeText,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

import { larkClient } from './Base';
import { HR_BASE_ID } from './Person';

export type Department = Record<
  'id' | 'name' | 'logo' | 'tags' | 'summary' | 'superior',
  TableCellValue
>;

export interface DepartmentNode extends Record<keyof Department, string> {
  children: DepartmentNode[];
  collapsed: boolean;
}

const DEPARTMENT_TABLE_ID = process.env.NEXT_PUBLIC_DEPARTMENT_TABLE_ID!;

export class DepartmentModel extends BiDataTable<Department>() {
  client = larkClient;

  constructor(appId = HR_BASE_ID, tableId = DEPARTMENT_TABLE_ID) {
    super(appId, tableId);
  }

  @computed
  get tree() {
    var rootName = '';

    const temp = this.allItems.reduce(
      (sum, item) => {
        const node = (sum[item.name as string] = {
          ...item,
          children: [],
          collapsed: false,
        } as DepartmentNode);

        const length = sum[node.superior as string]?.children.push(node);

        if (length === undefined) rootName = node.name as string;

        return sum;
      },
      {} as Record<string, DepartmentNode>,
    );

    return temp[rootName] || {};
  }

  normalize({
    id,
    fields: { superior, ...fields },
  }: TableRecord<Department>): Department {
    return {
      ...fields,
      id: id!,
      superior: (superior as TableCellRelation[])?.map(normalizeText)[0],
    };
  }
}
