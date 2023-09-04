import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
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
import { i18n } from '../../../models//Base/Translation';
import { ActivityModel } from '../../../models/Activity';
import { Person, PersonModel } from '../../../models/Personnel/Person';

interface PersonListPageProps extends RouteProps {
  list: Person[];
}

type VolunteerDetailPageProps = RouteProps<{ id: string }>;

export const getServerSideProps = compose<{ id: string }, { list: Person[] }>(
  router,
  errorLogger,
  translator(i18n),

  // async query => {
  //   const list = await new PersonModel().getList({}, 1);
  //   console.log('list', list);
  //   return { props: JSON.stringify(list) };
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
  personStore?: PersonModel = undefined;

  async componentDidMount() {
    const { id } = this.props.route.params!;
    this.activityStore = new ActivityModel();
    await this.activityStore.getOne(id);
    this.personStore = this.activityStore.currentPerson;
    console.log('this.personstroe', this.personStore);
  }

  render() {
    const { activityStore, personStore } = this;
    console.log('personStore', personStore);

    return (
      <Container style={{ height: '91vh' }}>
        <PageHead />
      </Container>
    );
  }
}
