import { debounce } from 'lodash';
import { observable } from 'mobx';
import { DataObject, NewData, ListModel, Stream } from 'mobx-restful';
import { Component, ReactNode } from 'react';
import { EdgePosition, Loading, ScrollBoundary } from 'idea-react';
import { i18n } from '../models/Translation';

export interface ScrollListProps<T extends DataObject = DataObject> {
  value?: T[];
  selectedIds?: string[];
  onSelect?: (selectedIds: string[]) => any;
}

type DataType<P> = P extends ScrollListProps<infer D> ? D : never;

export abstract class ScrollList<
  P extends ScrollListProps,
> extends Component<P> {
  abstract store: ListModel<DataType<P>>;

  filter: NewData<DataType<P>> = {};

  @observable
  selectedIds: string[] = [];

  async componentDidMount() {
    const BaseStream = Stream<DataObject>;

    const store = this.store as unknown as InstanceType<
        ReturnType<typeof BaseStream>
      >,
      { value } = this.props,
      filter = this.filter as NewData<DataObject>;

    store.clear();

    if (value) await store.restoreList({ allItems: value, filter });

    await store.getList(filter, store.pageList.length + 1);
  }

  componentWillUnmount() {
    this.store.clear();
  }

  loadMore = debounce((edge: EdgePosition) => {
    const { store } = this;

    if (edge === 'bottom' && store.downloading < 1 && !store.noMore)
      store.getList(this.filter);
  });

  abstract renderList(): ReactNode;

  render() {
    const { downloading, uploading, noMore, allItems } = this.store;

    return (
      <ScrollBoundary onTouch={this.loadMore}>
        <div>
          {(downloading > 0 || uploading > 0) && <Loading />}

          {this.renderList()}

          <footer className="mt-4 text-center text-muted small">
            {noMore || !allItems.length
              ? i18n.t('no_more')
              : i18n.t('load_more')}
          </footer>
        </div>
      </ScrollBoundary>
    );
  }
}
