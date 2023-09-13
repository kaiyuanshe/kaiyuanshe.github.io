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

import PageHead from '../../../components/Layout/PageHead';
import { MemberCard } from '../../../components/Member/Card';
import { MemberTitle } from '../../../components/Member/Title';
import { i18n } from '../../../models//Base/Translation';
import { Activity, ActivityModel } from '../../../models/Activity';
import { Staff, StaffModel } from '../../../models/Activity/Staff';
import { blobURLOf } from '../../../models/Base';

interface staffGroup {
  [key: string]: Staff[];
}

interface VolunteerPageProps {
  activity: Activity;
  staff: staffGroup;
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

    const { name = '' } = activity;

    return (
      <Container className="py-5">
        <PageHead title={t('volunteer') + '-' + name} />
        <h1 className="text-center">{name + ' ' + t('volunteer')}</h1>

        {Object.keys(staff).map(key => {
          return (
            <section key={key} id={key}>
              <MemberTitle
                className="my-5"
                title={key === 'undefined' ? '未分类志愿者' : key}
                count={staff[key].length}
              />
              <ul className="list-unstyled d-flex flex-wrap gap-4">
                {staff[key].map(this.renderVolunteers)}
              </ul>
            </section>
          );
        })}
      </Container>
    );
  }
}
