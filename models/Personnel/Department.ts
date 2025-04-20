import { computed, observable } from 'mobx';
import {
  BiDataQueryOptions,
  BiDataTable,
  BiSearch,
  normalizeText,
  TableCellLink,
  TableCellRelation,
  TableCellText,
  TableCellValue,
  TableRecord,
} from 'mobx-lark';

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
  | 'logo'
  | 'active',
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

  @observable
  accessor activeShown = true;

  @computed
  get tree() {
    const { activeShown } = this;
    var rootName = '';

    const tempList = this.allItems.map(({ name, ...meta }) => [
      name,
      { ...meta, name, children: [], collapsed: false },
    ]) as [string, DepartmentNode][];

    const tempMap = Object.fromEntries(tempList) as Record<
      string,
      DepartmentNode
    >;

    for (const [name, node] of tempList)
      if (!name.endsWith('组') || (activeShown ? node.active : !node.active)) {
        const superChildrenLength = tempMap[node.superior]?.children.push(node);

        if (superChildrenLength === undefined) rootName = name;
      }
    return tempMap[rootName] || {};
  }

  extractFields({
    id,
    fields: { superior, link, codeLink, active, ...fields },
  }: TableRecord<Department>): Department {
    return {
      ...fields,
      id: id!,
      superior: (superior as TableCellRelation[])?.map(normalizeText)[0],
      link: (link as TableCellLink)?.link,
      codeLink: (codeLink as TableCellLink)?.link,
      active: JSON.parse((active as TableCellText[])!.map(normalizeText) + ''),
    };
  }

  toggleActive = () => (this.activeShown = !this.activeShown);
}

export class SearchDepartmentModel extends BiSearch<Department>(
  DepartmentModel,
) {
  searchKeys = ['name', 'summary', 'email', 'link', 'codeLink'] as const;
}
