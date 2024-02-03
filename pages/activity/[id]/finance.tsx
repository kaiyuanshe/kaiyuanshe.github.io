import { Loading, text2color } from 'idea-react';
import { computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Column, RestTable } from 'mobx-restful-table';
import {
  compose,
  errorLogger,
  RouteProps,
  router,
  translator,
} from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Badge, Breadcrumb, Container } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import PageHead from '../../../components/Layout/PageHead';
import { ActivityModel } from '../../../models/Activity';
import { Bill, BillModel } from '../../../models/Activity/Bill';
import { i18n } from '../../../models/Base/Translation';

type BillDetailPageProps = RouteProps<{ id: string }>;

export const getServerSideProps = compose<{ id: string }, BillDetailPageProps>(
  router,
  errorLogger,
  translator(i18n),
);

const { t } = i18n;

@observer
export default class BillDetailPage extends PureComponent<BillDetailPageProps> {
  @observable
  accessor activityStore: ActivityModel | undefined;

  @observable
  accessor billStore: BillModel | undefined;

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
      },
      {
        key: 'type',
        renderHead: t('bill_type'),
        renderBody: ({ type }) => (
          <Badge bg={text2color(type + '', ['light'])}>{type + ''}</Badge>
        ),
      },
      {
        key: 'price',
        renderHead: t('bill_price'),
        renderBody: ({ price }) => `￥${price}`,
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
      { id, name = '' } = activityStore?.currentOne || {};

    return (
      <Container style={{ height: '91vh' }}>
        <PageHead title={t('financial_disclosure') + '-' + name} />
        <Breadcrumb>
          <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
          <Breadcrumb.Item href="/activity">{t('activity')}</Breadcrumb.Item>
          <Breadcrumb.Item href={`/activity/${id}`}>
            {name as string}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{t('financial_disclosure')}</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="mt-5 mb-4">{name + ' ' + t('financial_disclosure')}</h1>

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
