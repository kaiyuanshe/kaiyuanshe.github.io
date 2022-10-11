import { buildURLData } from 'web-utility';
import { DataObject, NewData, RESTClient } from 'mobx-restful';
import {
  Lark,
  TableCellText,
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecordList,
} from 'lark-ts-sdk';

import { isServer } from './Base';

const LARK_APP_ID = process.env.LARK_APP_ID!,
  LARK_APP_SECRET = process.env.LARK_APP_SECRET!,
  LARK_BITABLE_ID = process.env.LARK_BITABLE_ID!,
  LARK_BITABLE_GROUP_ID = process.env.LARK_BITABLE_GROUP_ID!,
  LARK_BITABLE_ORGANIZATION_ID = process.env.LARK_BITABLE_ORGANIZATION_ID!;

export const lark = new Lark({
  appId: LARK_APP_ID,
  appSecret: LARK_APP_SECRET,
});

export const makeFilter = (data: DataObject) =>
  Object.entries(data)
    .map(([key, value]) => `CurrentValue.[${key}].contains("${value}")`)
    .join('&&');

export const normalizeText = (
  value: TableCellText | TableCellLink | TableCellRelation,
) =>
  value && typeof value === 'object' && 'text' in value ? value.text : value;

export interface LarkFilter extends DataObject {
  page_size?: number;
  page_token?: string;
}

export interface LarkBITableQuery {
  database?: string;
  table: string;
  filter?: LarkFilter;
}

export async function getBITableList<T extends Record<string, TableCellValue>>({
  database = LARK_BITABLE_ID,
  table: TID,
  filter: { page_size, page_token, ...filter } = {},
}: LarkBITableQuery) {
  const biTable = await lark.getBITable(database);

  const table = await biTable.getTable<T>(TID);

  const { body } = await lark.client.get<TableRecordList<T>>(
    `${table!.baseURI}/records?${buildURLData({
      page_size,
      page_token,
      filter: makeFilter(filter),
    })}`,
  );
  return body!.data;
}

const RouteTableMap = {
  group: LARK_BITABLE_GROUP_ID,
  organization: LARK_BITABLE_ORGANIZATION_ID,
};

export async function* createListStream<T extends DataObject>(
  client: RESTClient,
  path: string,
  filter?: NewData<T>,
) {
  var table = RouteTableMap[path as keyof typeof RouteTableMap],
    lastPage = '';

  do {
    const query = { ...filter, page_size: 100, page_token: lastPage };

    var { items, total, has_more, page_token } =
      isServer() && table
        ? await getBITableList<T>({ table, filter: query })
        : (
            await client.get<TableRecordList<T>['data']>(
              `${path}?${buildURLData(query)}`,
            )
          ).body!;

    lastPage = page_token;

    yield { items, total };
  } while (has_more);
}
