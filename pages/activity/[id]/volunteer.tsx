import { Loading } from 'idea-react';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  cache,
  compose,
  errorLogger,
  RouteProps,
  translator,
} from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';

import { MemberCard } from '../../../components/Member/Card';
import { MemberTitle } from '../../../components/Member/Title';
import PageHead from '../../../components/PageHead';
import { i18n } from '../../../models//Base/Translation';
import { Activity, ActivityModel } from '../../../models/Activity';
import { Staff, StaffModel } from '../../../models/Activity/Staff';
import { blobURLOf } from '../../../models/Base';

interface VolunteerPageProps {
  activity: Activity;
  staff: Staff;
}

const { t } = i18n;

export const getServerSideProps = compose<{ id: string }, VolunteerPageProps>(
  cache(),
  errorLogger,

  translator(i18n),
  async ({ params }) => {
    const activityStore = new ActivityModel();
    const { id } = params!;
    const activity = await activityStore.getOne(id);
    const staff = await activityStore.currentStaff?.getGroup({
      role: '志愿者',
    });

    return {
      props: JSON.parse(JSON.stringify({ activity, staff })),
    };
  },
);

@observer
export default class VolunteerPage extends PureComponent<VolunteerPageProps> {
  constructor(props: VolunteerPageProps) {
    super(props);
    makeObservable(this);
  }

  renderVolunteers = ({ id, name, avatar }: Staff) => (
    <li
      key={id as string}
      className="d-flex flex-column align-items-center gap-2 position-relative"
    >
      <MemberCard name={name + ''} nickname={''} avatar={blobURLOf(avatar)} />
    </li>
  );

  render() {
    const { activity, staff } = this.props;

    // const loading =  staff.length || 0;
    const { name = '' } = activity;

    return (
      <Container className="py-5">
        <PageHead title={t('volunteer') + '-' + name} />
        <h1 className="text-center">{name + ' ' + t('volunteer')}</h1>
        {/* {loading > 0 && <Loading />} */}
        <h4>{JSON.stringify(staff)}</h4>
        {/* <section>
          <MemberTitle
            className="my-5"
            title={t('volunteer')}
            count={staff?.length}
          />
          <ul className="list-unstyled d-flex flex-wrap grap-3">
            {staff?.map(this.renderVolunteers)}
          </ul>
        </section> */}
      </Container>
    );
  }
}
