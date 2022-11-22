import { isEmpty, buildURLData } from 'web-utility';
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

export const LARK_APP_ID = process.env.LARK_APP_ID!,
  LARK_APP_SECRET = process.env.LARK_APP_SECRET!,
  LARK_BITABLE_ID = process.env.LARK_BITABLE_ID!,
  LARK_BITABLE_MEMBERS_ID = process.env.LARK_BITABLE_MEMBERS_ID!,
  LARK_BITABLE_GROUP_ID = process.env.LARK_BITABLE_GROUP_ID!,
  LARK_BITABLE_ORGANIZATION_ID = process.env.LARK_BITABLE_ORGANIZATION_ID!,
  ARTICLE_LARK_BASE_ID = process.env.ARTICLE_LARK_BASE_ID!,
  ARTICLE_LARK_TABLE_ID = process.env.ARTICLE_LARK_TABLE_ID!,
  LARK_BITABLE_ACTIVITY_ID = process.env.LARK_BITABLE_ACTIVITY_ID!;


export const lark = new Lark({
  appId: LARK_APP_ID,
  appSecret: LARK_APP_SECRET,
});

/**
 * @see https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/bitable-v1/filter
 */
export function makeFilter(data: DataObject, relation: 'AND' | 'OR' = 'AND') {
  const list = Object.entries(data)
    .map(([key, value]) => {
      if (isEmpty(value)) return;

      value = value instanceof Array ? value : [value];

      return value.map(
        (item: string) => `CurrentValue.[${key}].contains("${item}")`,
      );
    })
    .filter(Boolean)
    .flat();

  return list[1] ? `${relation}(${list})` : list[0];
}

export const normalizeText = (
  value: TableCellText | TableCellLink | TableCellRelation,
) =>
  value && typeof value === 'object' && 'text' in value ? value.text : value;

export interface LarkBITableQuery {
  database?: string;
  table: string;
  page_size?: number;
  page_token?: string;
  filter?: string;
}

export async function getBITableList<T extends Record<string, TableCellValue>>({
  database = LARK_BITABLE_ID,
  table: TID,
  page_size,
  page_token,
  filter,
}: LarkBITableQuery) {
  const biTable = await lark.getBITable(database);

  const table = await biTable.getTable<T>(TID);

  const { body } = await lark.client.get<TableRecordList<T>>(
    `${table!.baseURI}/records?${buildURLData({
      page_size,
      page_token,
      filter,
    })}`,
  );
  return body!.data;
}

const RouteTableMap: Record<string, LarkBITableQuery> = {
  article: { database: ARTICLE_LARK_BASE_ID, table: ARTICLE_LARK_TABLE_ID },
  members: { table: LARK_BITABLE_MEMBERS_ID },
  group: { table: LARK_BITABLE_GROUP_ID },
  organization: { table: LARK_BITABLE_ORGANIZATION_ID },
};

export async function* createListStream<T extends DataObject>(
  client: RESTClient,
  path: string,
  filter?: NewData<T>,
) {
  var baseTable = RouteTableMap[path as keyof typeof RouteTableMap],
    lastPage = '';

  do {
    const query = {
      page_size: 100,
      page_token: lastPage,
    };

    var { items, total, has_more, page_token } =
      isServer() && baseTable
        ? await getBITableList<T>({
            ...baseTable,
            ...query,
            filter: filter && makeFilter(filter),
          })
        : (
            await client.get<TableRecordList<T>['data']>(
              `${path}?${buildURLData({ ...query, ...filter })}`,
            )
          ).body!;

    lastPage = page_token;

    yield { items, total };
  } while (has_more);
}
