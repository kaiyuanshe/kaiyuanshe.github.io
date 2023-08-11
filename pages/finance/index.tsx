import { computed } from 'mobx';
import { observer } from 'mobx-react';
import { Column, RestTable } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { compose, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { Bill, BillModel } from '../../models/Bill';
import { i18n } from '../../models/Translation';
import { MAIN_BASE_ID } from '../api/lark/core';

export const getServerSideProps = compose<
  {},
  { list: Bill[]; billStore: BillModel }
>(
  translator(i18n),

  async ({ params }) => {
    const billStore = new BillModel(MAIN_BASE_ID, params!.id + '');
    const list = await billStore.getList();

    return {
      props: { list: structuredClone(list), billStore },
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
        key: 'id',
      },
      {
        renderHead: t('bill_createAt'),
        key: 'createdAt',
      },
      {
        renderHead: t('bill_createBy'),
        key: 'createdBy',
      },
      {
        renderHead: t('bill_type'),
        key: 'type',
      },
    ];
  }

  render() {
    const { list, billStore } = this.props;

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
          defaultData={list}
        />
      </Container>
    );
  }
}
