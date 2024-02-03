import { computed } from 'mobx';
import {
  BiDataQueryOptions,
  BiDataTable,
  makeSimpleFilter,
  normalizeText,
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';
import { NewData } from 'mobx-restful';
import { isEmpty } from 'web-utility';

import { larkClient } from '../Base';
import { HR_BASE_ID } from './Person';

export const DEPARTMENT_TABLE_ID = process.env.NEXT_PUBLIC_DEPARTMENT_TABLE_ID!;

export type Department = Record<
  | 'id'
  | 'name'
  | 'tags'
  | 'startDate'
  | 'summary'
  | 'superior'
  | 'document'
  | 'email'
  | 'link'
  | 'codeLink'
  | 'logo',
  TableCellValue
>;

export interface DepartmentNode extends Record<keyof Department, string> {
  children: DepartmentNode[];
  collapsed: boolean;
}

export class DepartmentModel extends BiDataTable<Department>() {
  client = larkClient;

  constructor(appId = HR_BASE_ID, tableId = DEPARTMENT_TABLE_ID) {
    super(appId, tableId);
  }

  requiredKeys = ['name'] as const;

  queryOptions: BiDataQueryOptions = { text_field_as_array: false };

  @computed
  get tree() {
    var rootName = '';

    const tempList = this.allItems.map(({ name, ...meta }) => [
      name,
      { ...meta, name, children: [], collapsed: false },
    ]) as [string, DepartmentNode][];

    const tempMap = Object.fromEntries(tempList) as Record<
      string,
      DepartmentNode
    >;

    for (const [name, node] of tempList) {
      const superChildrenLength = tempMap[node.superior]?.children.push(node);

      if (superChildrenLength === undefined) rootName = name;
    }

    return tempMap[rootName] || {};
  }

  normalize({
    id,
    fields: { superior, link, codeLink, ...fields },
  }: TableRecord<Department>): Department {
    return {
      ...fields,
      id: id!,
      superior: (superior as TableCellRelation[])?.map(normalizeText)[0],
      link: (link as TableCellLink)?.link,
      codeLink: (codeLink as TableCellLink)?.link,
    };
  }
}

export class SearchDepartmentModel extends DepartmentModel {
  makeFilter(filter: NewData<Department>) {
    return isEmpty(filter) ? '' : makeSimpleFilter(filter, 'contains', 'OR');
  }
}
