import { makeObservable,observable } from 'mobx';
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

type VolunteerDetailPageProps = RouteProps<{ id: string }>;

export const getServerSideProps = compose<{ id: string }, PersonListPageProps>(
  router,
  errorLogger,
  translator(i18n),

  // async () => {
  //   const list = await new PersonModel().getList({}, 1);

  //   return { props: { list } as PersonListPageProps };
  // },
);

const { t } = i18n;

@observer
export default class VolunteerPage extends PureComponent<VolunteerDetailPageProps> {
  constructor(props: VolunteerDetailPageProps) {
    super(props);
    makeObservable(this);
  }

  @observable
  activityStore?: ActivityModel = undefined;

  @observable
  PersonStore?: PersonModel = undefined;

  async componentDidMount() {
    const { id } = this.props.route.params!;
    this.activityStore = new ActivityModel();
    await this.activityStore.getOne(id);
    this.PersonStore = this.activityStore.currentPerson;
  }

  render() {
    console.log('this.activityStore', this.PersonStore);
    return (
      <Container style={{ height: '91vh' }}>
        <PageHead />
      </Container>
    );
  }
}
