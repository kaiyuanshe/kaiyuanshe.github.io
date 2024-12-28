import { observer } from 'mobx-react';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { Component } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';

import { PageHead } from '../../../components/Layout/PageHead';
import { MemberCard } from '../../../components/Member/Card';
import { MemberTitle } from '../../../components/Member/Title';
import { Activity, ActivityModel } from '../../../models/Activity';
import { Staff, StaffModel } from '../../../models/Activity/Staff';
import { i18n, t } from '../../../models/Base/Translation';
import { fileURLOf } from '../../api/lark/file/[id]';

interface VolunteerPageProps {
  activity: Activity;
  staffGroup: StaffModel['group'];
}

export const getServerSideProps = compose<{ id: string }, VolunteerPageProps>(
  cache(),
  errorLogger,
  translator(i18n),
  async ({ params: { id } = {} }) => {
    const activityStore = new ActivityModel();

    const activity = await activityStore.getOne(id!);

    const staffGroup = await activityStore.currentPerson?.getGroup({
      role: '志愿者 (Volunteer)',
    });

    return {
      props: JSON.parse(JSON.stringify({ activity, staffGroup })),
    };
  },
);

@observer
export default class VolunteerPage extends Component<VolunteerPageProps> {
  renderVolunteers = ({ id, name, avatar }: Staff) => (
    <li
      key={id as string}
      className="d-flex flex-column align-items-center gap-2 position-relative"
    >
      <MemberCard
        name={name + ''}
        nickname=""
        avatar={fileURLOf(avatar, true)}
      />
    </li>
  );

  render() {
    const { activity, staffGroup } = this.props;
    const { id, name = '' } = activity;

    return (
      <Container className="py-5">
        <PageHead title={t('volunteer') + '-' + name} />
        <Breadcrumb>
          <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
          <Breadcrumb.Item href="/activity">{t('activity')}</Breadcrumb.Item>
          <Breadcrumb.Item href={`/activity/${id}`}>
            {name as string}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{t('volunteer')}</Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="text-center">{name + ' ' + t('volunteer')}</h1>
        {Object.entries(staffGroup)
          .sort(([a], [b]) =>
            a === 'undefined' ? 1 : b === 'undefined' ? -1 : 0,
          )
          .map(([key, list]) => (
            <section key={key} id={key}>
              <MemberTitle
                className="my-5"
                title={key === 'undefined' ? '未分类志愿者' : key}
                count={list.length}
              />
              <ul className="list-unstyled d-flex flex-wrap gap-4">
                {list.map(this.renderVolunteers)}
              </ul>
            </section>
          ))}
      </Container>
    );
  }
}
