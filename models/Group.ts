import { TableCellLink, TableCellValue, TableRecordList } from 'lark-ts-sdk';

import { BiTable, MAIN_BASE_ID, normalizeText } from './Lark';

export const GROUP_TABLE_ID = process.env.NEXT_PUBLIC_GROUP_TABLE_ID!;

export type Group = Record<
  | 'id'
  | 'name'
  | 'type'
  | 'fullName'
  | 'tags'
  | 'startDate'
  | 'leader'
  | 'members'
  | 'summary'
  | 'document'
  | 'email'
  | 'link'
  | 'codeLink'
  | 'logo',
  TableCellValue
>;

export class GroupModel extends BiTable<Group>() {
  constructor(appId = MAIN_BASE_ID, tableId = GROUP_TABLE_ID) {
    super(appId, tableId);
  }

  normalize({
    id,
    fields: { link, codeLink, email, ...fields },
  }: TableRecordList<Group>['data']['items'][number]) {
    return {
      ...fields,
      id: id!,
      link: normalizeText(link as TableCellLink),
      codeLink: normalizeText(codeLink as TableCellLink),
      email: normalizeText(email as TableCellLink),
    };
  }
}

export default new GroupModel();
