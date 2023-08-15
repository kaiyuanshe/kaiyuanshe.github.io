import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Column, RestTable } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { compose, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { Activity, ActivityModel } from '../../models/Activity';
import { Bill, BillModel } from '../../models/Bill';
import { i18n } from '../../models/Translation';

const billStore = new BillModel();

export const getServerSideProps = compose<
  {},
  {
    currentMeta: ActivityModel['currentMeta'];
    bills: Bill[];
  }
>(
  translator(i18n),

  async ({}) => {
    const activityStore = new ActivityModel();

    const [bills] = await Promise.all([activityStore.currentBill!.getList()]);

    return {
      props: { list: structuredClone({ bills }) },
    };
  },
);

const { t } = i18n;

@observer
export default class BillDetailPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  @computed
  get columns(): Column<Bill>[] {
    return [
      {
        renderHead: t('bill_id'),
        type: 'bill_id',
        key: 'id',
      },
      {
        renderHead: t('bill_createAt'),
        type: 'bill_createAt',
        key: 'createdAt',
      },
      {
        renderHead: t('bill_createBy'),
        type: 'bill_createBy',
        key: 'createdBy',
      },
      {
        renderHead: t('bill_type'),
        type: 'bill_type',
        key: 'type',
      },
    ];
  }

  render() {
    const { bills } = this.props;

    return (
      <Container style={{ height: '91vh' }}>
        <PageHead title="财务公开" />
        <h1>财务公开</h1>

        <RestTable
          className="h-100 text-center"
          striped
          hover
          translator={i18n}
          store={billStore}
          columns={this.columns}
          defaultData={bills}
        />
      </Container>
    );
  }
}
