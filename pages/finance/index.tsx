import { observer } from 'mobx-react';
import { Column, RestTable } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { compose } from 'next-ssr-middleware';
import { FC, PureComponent } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/PageHead';
import { Bill, BillModel } from '../../models/Bill';
import { i18n } from '../../models/Translation';

const { t } = i18n;

export const getServerSideProps = compose<{ id: string }>(
  async ({ params }) => {
    const billStrore = new BillModel();
    const bill = await billStrore.getOne(params!.id);

    return {
      props: JSON.parse(JSON.stringify(bill)),
    };
  },
);

@observer
export default class BillDetail extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  render() {
    const { bill } = this.props;

    return (
      <Container style={{ height: '91vh' }}>
        <PageHead title="财务公开" />

        <RestTable
          className="h-100 text-center"
          striped
          hover
          editable
          deletable
          store={bill}
          onCheck={console.log}
        />
      </Container>
    );
  }
}
