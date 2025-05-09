import { CheckEvent, User } from '@kaiyuanshe/kys-service';
import { Avatar, TimeDistance } from 'idea-react';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { ScrollList } from 'mobx-restful-table';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { Breadcrumb, Button, Col, Container, Row } from 'react-bootstrap';

import { AnnouncementCard } from '../../components/Governance/AnnouncementCard';
import { PageHead } from '../../components/Layout/PageHead';
import { CheckEventModel } from '../../models/Activity/CheckEvent';
import { i18n, I18nContext } from '../../models/Base/Translation';
import userStore, { UserModel } from '../../models/Base/User';
import { AnnouncementModel } from '../../models/Personnel/Announcement';

interface UserProfilePageProps {
  user: User;
  checkEvents: CheckEvent[];
}

export const getServerSideProps = compose<{ id: string }, UserProfilePageProps>(
  cache(),
  errorLogger,
  async ({ params: { id } = {} }) => {
    const user = await new UserModel().getOne(id!);

    const checkEvents = await new CheckEventModel().getList({ user: user.id });

    return { props: JSON.parse(JSON.stringify({ user, checkEvents })) };
  },
);

@observer
export default class UserProfilePage extends ObservedComponent<UserProfilePageProps, typeof i18n> {
  static contextType = I18nContext;

  checkEventStore = new CheckEventModel();
  announcementStore = new AnnouncementModel();

  renderActivityChecks(activityId: string, list: CheckEvent[]) {
    return (
      <details key={activityId}>
        <summary>
          <a
            className="text-decoration-none"
            target="_blank"
            href={`/activity/${activityId}`}
            rel="noreferrer"
          >
            {list[0].activityName}
          </a>
        </summary>
        <ol>
          {list.map(({ createdAt, agendaId, agendaTitle }) => (
            <li key={agendaId}>
              <div className="d-flex justify-content-between">
                <a
                  className="text-decoration-none"
                  target="_blank"
                  href={`/activity/${activityId}/agenda/${agendaId}`}
                  rel="noreferrer"
                >
                  {agendaTitle}
                </a>

                <TimeDistance date={createdAt} />
              </div>
            </li>
          ))}
        </ol>
      </details>
    );
  }

  renderMemberAnnouncement = (email: string) => {
    const { t } = this.observedContext;

    return (
      <>
        <h2>{t('member_announcement')}</h2>

        <ScrollList
          translator={i18n}
          store={this.announcementStore}
          filter={{ emails: email }}
          renderList={allItems =>
            allItems.map(item => (
              <AnnouncementCard key={item.id + ''} className="mx-auto" {...item} />
            ))
          }
        />
      </>
    );
  };

  render() {
    const { t } = this.observedContext,
      { user, checkEvents } = this.props,
      { session } = userStore;
    const { id, nickName, avatar, mobilePhone, email } = user;

    const title = t('user_Open_Source_Passport', {
      user: nickName || mobilePhone,
    });

    return (
      <Container className="mt-5">
        <PageHead title={title} />

        <Breadcrumb>
          <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
          <Breadcrumb.Item>{t('Open_Source_Passport')}</Breadcrumb.Item>
          <Breadcrumb.Item active>{title}</Breadcrumb.Item>
        </Breadcrumb>

        <Row className="g-3 my-3">
          <Col xs={12} sm={4} className="d-flex flex-column gap-3 align-items-center">
            <h1>{title}</h1>

            {avatar && <Avatar size={10} src={avatar} />}
            <Button size="lg" variant="outline-primary" href={`/member/${nickName}`}>
              {t('community_member')}
            </Button>

            {session?.id === id && email && this.renderMemberAnnouncement(email)}
          </Col>

          <Col xs={12} sm={8}>
            <h2>{t('activity_footprint')}</h2>

            <ScrollList
              translator={i18n}
              store={this.checkEventStore}
              filter={{ user: id }}
              renderList={() =>
                Object.entries(this.checkEventStore.group).map(([activityId, list]) =>
                  this.renderActivityChecks(activityId, list),
                )
              }
              defaultData={checkEvents}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}
