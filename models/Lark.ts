import { buildURLData } from 'web-utility';
import { DataObject, NewData, RESTClient } from 'mobx-restful';
import {
  Lark,
  TableCellLink,
  TableCellRelation,
  TableRecordList,
} from 'lark-ts-sdk';

const LARK_APP_ID = process.env.LARK_APP_ID!,
  LARK_APP_SECRET = process.env.LARK_APP_SECRET!;

export const lark = new Lark({
  appId: LARK_APP_ID,
  appSecret: LARK_APP_SECRET,
});

export const makeFilter = (data: DataObject) =>
  Object.entries(data)
    .map(([key, value]) => `CurrentValue.[${key}].contains("${value}")`)
    .join('&&');

export const normalizeText = (value: TableCellLink | TableCellRelation) =>
  value && typeof value === 'object' && 'text' in value ? value.text : value;

export async function* createListStream<T extends DataObject>(
  client: RESTClient,
  path: string,
  filter?: NewData<T>,
) {
  var lastPage = '';

  do {
    const { body } = await client.get<TableRecordList<T>['data']>(
      `${path}?${buildURLData({
        ...filter,
        page_size: 100,
        page_token: lastPage,
      })}`,
    );
    var { items, total, has_more, page_token } = body!;

    lastPage = page_token;

    yield { items, total };
  } while (has_more);
}
