import { Loading } from 'idea-react';
import { ScrollList, ScrollListProps } from 'mobx-restful-table';

import { i18n } from '../models/Translation';

export abstract class XScrollList<
  P extends ScrollListProps,
> extends ScrollList<P> {
  translater = i18n;

  render() {
    const { downloading, uploading } = this.store;

    return (
      <>
        {(downloading > 0 || uploading > 0) && <Loading />}

        {super.render()}
      </>
    );
  }
}
