import { Loading } from 'idea-react';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Column, RestTable } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import {
  cache,
  compose,
  errorLogger,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../../components/PageHead';
import { ActivityModel } from '../../../models/Activity';
import { Bill, BillModel } from '../../../models/Bill';
import { i18n } from '../../../models/Translation';

export const getServerSideProps = compose<
  { id: string },
  RouteProps<{ id: string }>
>(cache(), router, errorLogger, translator(i18n));

const { t } = i18n;

@observer
export default class BillDetailPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  @observable
  activityStore?: ActivityModel;

  @observable
  billStore?: BillModel;

  async componentDidMount() {
    const { id } = this.props.route.params!;

    this.activityStore = new ActivityModel();

    await this.activityStore.getOne(id);

    this.billStore = this.activityStore.currentBill;
  }

  @computed
  get columns(): Column<Bill>[] {
    return [
      {
        key: 'id',
        renderHead: t('bill_id'),
      },
      {
        key: 'createdAt',
        renderHead: t('bill_createAt'),
      },
      {
        key: 'location',
        renderHead: t('bill_location'),
      },
      {
        key: 'createdBy',
        renderHead: t('bill_createBy'),
      },
      {
        key: 'type',
        renderHead: t('bill_type'),
      },
      {
        key: 'price',
        renderHead: t('bill_price'),
      },
      {
        key: 'invoice',
        renderHead: t('bill_invoice'),
      },
      {
        key: 'remark',
        renderHead: t('bill_remark'),
      },
      {
        key: 'travelFundTask',
        renderHead: t('bill_travelFundTask'),
      },
      {
        key: 'forum',
        renderHead: t('bill_forum'),
      },
      {
        key: 'agendas',
        renderHead: t('bill_agendas'),
      },
    ];
  }

  render() {
    const { activityStore, billStore } = this;
    const loading = activityStore?.downloading || billStore?.downloading || 0,
      { name = '' } = activityStore?.currentOne || {};

    return (
      <Container style={{ height: '91vh' }}>
        <PageHead title={`财务公开 - ${name}`} />
        <h1 className="mt-5 mb-4">{name} 财务公开</h1>

        {loading > 0 && <Loading />}

        {billStore && (
          <RestTable
            className="h-100 text-center"
            translator={i18n}
            store={billStore}
            columns={this.columns}
          />
        )}
      </Container>
    );
  }
}
