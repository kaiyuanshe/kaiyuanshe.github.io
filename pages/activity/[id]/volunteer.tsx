import { observer } from 'mobx-react';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../../components/Layout/PageHead';
import { MemberCard } from '../../../components/Member/Card';
import { MemberTitle } from '../../../components/Member/Title';
import { i18n } from '../../../models//Base/Translation';
import { Activity, ActivityModel } from '../../../models/Activity';
import { Staff } from '../../../models/Activity/Staff';
import { blobURLOf } from '../../../models/Base';

interface StaffGroup {
  [key: string]: Staff[];
}

interface VolunteerPageProps {
  activity: Activity;
  staffGroup: StaffGroup;
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
    const staffGroup = await activityStore.currentStaff?.getGroup({
      role: '志愿者',
    });

    return {
      props: JSON.parse(JSON.stringify({ activity, staffGroup })),
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
    const { activity, staffGroup } = this.props;

    const { name = '' } = activity;

    return (
      <Container className="py-5">
        <PageHead title={t('volunteer') + '-' + name} />
        <h1 className="text-center">{name + ' ' + t('volunteer')}</h1>

        {Object.keys(staffGroup).map(key => {
          return (
            <section key={key} id={key}>
              <MemberTitle
                className="my-5"
                title={key === 'undefined' ? '未分类志愿者' : key}
                count={staffGroup[key].length}
              />
              <ul className="list-unstyled d-flex flex-wrap gap-4">
                {staffGroup[key].map(this.renderVolunteers)}
              </ul>
            </section>
          );
        })}
      </Container>
    );
  }
}
