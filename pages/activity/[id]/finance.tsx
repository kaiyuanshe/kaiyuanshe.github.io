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
        renderBody: ({ id }) => <a>{id}</a>,
      },
      {
        key: 'createdAt',
        renderHead: t('bill_createAt'),
        renderBody: ({ createdAt }) => <a>{createdAt}</a>,
      },
      {
        key: 'location',
        renderHead: t('bill_location'),
        renderBody: ({ location }) => <a>{location}</a>,
      },
      {
        key: 'createdBy',
        renderHead: t('bill_createBy'),
        renderBody: ({ createdBy }) => <a>{createdBy}</a>,
      },
      {
        key: 'type',
        renderHead: t('bill_type'),
        renderBody: ({ type }) => <a>{type}</a>,
      },
      {
        key: 'price',
        renderHead: t('bill_price'),
        renderBody: ({ price }) => <a>{price}</a>,
      },
      {
        key: 'invoice',
        renderHead: t('bill_invoice'),
        renderBody: ({ invoice }) => <a>{invoice}</a>,
      },
      {
        key: 'remark',
        renderHead: t('bill_remark'),
        renderBody: ({ remark }) => <a>{remark}</a>,
      },
      {
        key: 'travelFundTask',
        renderHead: t('bill_travelFundTask'),
        renderBody: ({ remark }) => <a>{remark}</a>,
      },
      {
        key: 'forum',
        renderHead: t('bill_forum'),
        renderBody: ({ forum }) => <a>{forum}</a>,
      },
      {
        key: 'agendas',
        renderHead: t('bill_agendas'),
        renderBody: (bill: Bill) => bill.agendas,
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
        {console.log('activityStore', activityStore)}
        {console.log('billStore', billStore)}
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
