import { isEmpty, buildURLData } from 'web-utility';
import {
  DataObject,
  ListModel,
  NewData,
  RESTClient,
  Stream,
  toggle,
} from 'mobx-restful';
import {
  Lark,
  TableCellText,
  TableCellLink,
  TableCellRelation,
  TableCellValue,
  TableRecordList,
} from 'lark-ts-sdk';

import { TableRecordData } from '../pages/api/lark/core';
import { client, isServer } from './Base';

export const LARK_APP_ID = process.env.LARK_APP_ID!,
  LARK_APP_SECRET = process.env.LARK_APP_SECRET!,
  LARK_BITABLE_ID = process.env.LARK_BITABLE_ID!,
  LARK_BITABLE_MEMBERS_ID = process.env.LARK_BITABLE_MEMBERS_ID!,
  LARK_BITABLE_GROUP_ID = process.env.LARK_BITABLE_GROUP_ID!,
  LARK_BITABLE_ORGANIZATION_ID = process.env.LARK_BITABLE_ORGANIZATION_ID!,
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
    .map(
      ([key, value]) =>
        !isEmpty(value) &&
        (value instanceof Array ? value : [value]).map(
          (item: string) => `CurrentValue.[${key}].contains("${item}")`,
        ),
    )
    .filter(Boolean)
    .flat() as string[];

  return list[1] ? `${relation}(${list})` : list[0];
}

export const normalizeText = (
  value: TableCellText | TableCellLink | TableCellRelation,
) =>
  value && typeof value === 'object' && 'text' in value ? value.text : value;

export interface LarkBITableQuery<
  T extends Record<string, TableCellValue> = any,
> {
  database?: string;
  table: string;
  page_size?: number;
  page_token?: string;
  filter?: string;
  sort?: Partial<Record<keyof T, 'ASC' | 'DESC'>>;
}

export async function getBITableList<T extends Record<string, TableCellValue>>({
  database = LARK_BITABLE_ID,
  table: TID,
  page_size,
  page_token,
  filter,
  sort,
}: LarkBITableQuery<T>) {
  const biTable = await lark.getBITable(database);

  const table = await biTable.getTable<T>(TID);

  const { body } = await lark.client.get<TableRecordList<T>>(
    `${table!.baseURI}/records?${buildURLData({
      page_size,
      page_token,
      filter,
      sort:
        sort &&
        JSON.stringify(Object.entries(sort).map(item => item.join(' '))),
    })}`,
  );
  return body!.data;
}

const RouteTableMap: Record<
  string,
  Pick<LarkBITableQuery, 'database' | 'table'>
> = {
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

export function BiTable<T extends DataObject>(Base = ListModel) {
  abstract class BiTableListModel extends Stream<T>(Base) {
    client = client;

    sort: Partial<Record<keyof T, 'ASC' | 'DESC'>> = {};

    constructor(appId: string, tableId: string) {
      super();
      this.baseURI = `lark/bitable/v1/apps/${appId}/tables/${tableId}/records`;
    }

    normalize({ id, fields }: TableRecordList<T>['data']['items'][number]) {
      return { ...fields, id: id! };
    }

    @toggle('downloading')
    async getOne(id: string) {
      const { body } = await this.client.get<TableRecordData<T>>(
        `${this.baseURI}/${id}`,
      );
      return this.normalize(body!.data.record);
    }

    makeFilter(filter: NewData<T>) {
      return isEmpty(filter) ? undefined : makeFilter(filter);
    }

    async *openStream(filter: NewData<T>) {
      var lastPage = '';

      do {
        const { body } = await this.client.get<TableRecordList<T>>(
          `${this.baseURI}?${buildURLData({
            page_size: 100,
            page_token: lastPage,
            filter: this.makeFilter(filter),
            sort: JSON.stringify(
              Object.entries(this.sort).map(
                ([key, order]) => `${key} ${order}`,
              ),
            ),
          })}`,
        );
        var { items, total, has_more, page_token } = body!.data;

        lastPage = page_token;
        this.totalCount = total;

        yield* items.map(item => this.normalize(item));
      } while (has_more);
    }
  }
  return BiTableListModel;
}
