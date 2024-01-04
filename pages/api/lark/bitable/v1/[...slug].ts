import { LarkPageData, TableRecord } from 'mobx-lark';
import { DataObject } from 'mobx-restful';

import { proxyLark } from '../../core';

export default proxyLark((path, data) => {
  if (path.split('?')[0].endsWith('/records')) {
    const list =
      (data as LarkPageData<TableRecord<DataObject>>).data!.items || [];

    for (const { fields } of list)
      for (const key of Object.keys(fields))
        if (!/^\w+$/.test(key)) delete fields[key];
  }
  return data;
});
