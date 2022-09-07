import { buildURLData } from 'web-utility';
import { DataObject, RESTClient } from 'mobx-restful';
import { TableRecordList } from 'lark-ts-sdk';

export async function* createListStream<T extends DataObject>(
  client: RESTClient,
  path: string,
) {
  var lastPage = '';

  do {
    const { body } = await client.get<TableRecordList<T>['data']>(
      `${path}?${buildURLData({ page_size: 100, page_token: lastPage })}`,
    );
    var { items, total, has_more, page_token } = body!;

    lastPage = page_token;

    yield { items, total };
  } while (has_more);
}
