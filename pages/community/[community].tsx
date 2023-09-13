import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import { Person, PersonModel } from '../../models/Community/Person';

const { t } = i18n;

export const getServerSideProps = compose<
  { community: string },
  {
    list: Person[];
    community: string;
  }
>(
  cache(),
  errorLogger,
  translator(i18n),
  async ({ params: { community } = {} }) => {
    const activityStore = new PersonModel();

    const list = await activityStore.getList({ community });

    if (!list) return { notFound: true, props: {} };

    return { props: JSON.parse(JSON.stringify({ list, community })) };
  },
);

@observer
export default class ActivityDetailPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  render() {
    const { list, community } = this.props;

    console.log(list);

    return (
      <Container className="py-5">
        <PageHead title={community} />

        <h1 className="mb-5 text-center">{t('wonderful_activity')}</h1>
      </Container>
    );
  }
}
