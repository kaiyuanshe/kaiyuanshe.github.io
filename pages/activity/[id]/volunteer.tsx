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
import { Staff, StaffModel } from '../../../models/Activity/Staff';

type VolunteerDetailPageProps = RouteProps<{ id: string }>;

export const getServerSideProps = compose<
  { id: string },
  VolunteerDetailPageProps
>(router, errorLogger, translator(i18n));

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
  staffStore?: StaffModel = undefined;

  async componentDidMount() {
    const { id } = this.props.route.params!;
    this.activityStore = new ActivityModel();
    await this.activityStore.getOne(id);
    this.staffStore = this.activityStore.currentStaff;
    console.log('this.personStroe', this.staffStore);
  }

  render() {
    const { activityStore, staffStore } = this;
    console.log('personStore', staffStore);

    return (
      <Container style={{ height: '91vh' }}>
        <PageHead />
      </Container>
    );
  }
}
