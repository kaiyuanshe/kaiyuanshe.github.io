import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { FC, PureComponent } from 'react';

import PageHead from '../../components/PageHead';
import { Bill, BillModel } from '../../models/Bill';
import { i18n } from '../../models/Translation';
import { withErrorLog, withTranslation } from '../api/base';

const { t } = i18n;

export const getServerSideProps = withErrorLog<{ id: string }>(
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
> {}
