import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import {
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
import { Person, PersonModel } from '../../../models/Person';
import { i18n } from '../../../models/Translation';

interface PersonListPageProps extends RouteProps {
  list: Person[];
}

export const getServerSideProps = compose<{ id: string }, PersonListPageProps>(
  router,
  errorLogger,
  translator(i18n),

  async () => {
    const list = await new PersonModel().getList({}, 1);

    return { props: { list } as PersonListPageProps };
  },
);

const { t } = i18n;

@observer
export default class VolunteerPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  @observable
  activityStore?: ActivityModel;

  render() {
    console.log('this.activityStore', this.activityStore);
    return (
      <Container style={{ height: '91vh' }}>
        <PageHead />
      </Container>
    );
  }
}
