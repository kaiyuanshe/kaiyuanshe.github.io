import { create } from 'domain';
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
import { formatDate } from 'web-utility';

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
        key: 'createdAt',
        renderHead: t('bill_createAt'),
        renderBody: ({ createdAt }) =>
          formatDate(createdAt as number, 'YYYY-MM-DD'),
      },

      {
        key: 'createdBy',
        renderHead: t('bill_createBy'),
        renderBody: ({ createdBy = [] }) =>
          (createdBy as any[]).map(item => item.text).join(', '),
      },

      {
        key: 'type',
        renderHead: t('bill_type'),
        renderBody: ({ type }) => type,
      },
      {
        key: 'price',
        renderHead: t('bill_price'),
        renderBody: ({ price }) => price,
      },

      {
        key: 'remark',
        renderHead: t('bill_remark'),
        renderBody: ({ remark }) => remark,
      },
      {
        key: 'travelFundTask',
        renderHead: t('bill_travelFundTask'),
        renderBody: ({ travelFundTask }) => travelFundTask,
      },
      {
        key: 'forum',
        renderHead: t('bill_forum'),
        renderBody: ({ forum }) => JSON.stringify(forum),
      },
      {
        key: 'agendas',
        renderHead: t('bill_agendas'),
        renderBody: ({ agendas = [] }) =>
          (agendas as any[]).map(item => item.text).join(', '),
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
