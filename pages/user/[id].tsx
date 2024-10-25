import { CheckEvent, User } from '@kaiyuanshe/kys-service';
import { Avatar, TimeDistance } from 'idea-react';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { cache, compose, errorLogger } from 'next-ssr-middleware';
import { Component } from 'react';
import { Breadcrumb, Button, Col, Container, Row } from 'react-bootstrap';

import { PageHead } from '../../components/Layout/PageHead';
import { CheckEventModel } from '../../models/Activity/CheckEvent';
import { i18n, t } from '../../models/Base/Translation';
import { UserModel } from '../../models/Base/User';

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
export default class UserProfilePage extends Component<UserProfilePageProps> {
  store = new CheckEventModel();

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

  render() {
    const { user, checkEvents } = this.props;
    const { id, nickName, avatar, mobilePhone } = user;

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
          <Col
            xs={12}
            sm={4}
            className="d-flex flex-column gap-3 align-items-center"
          >
            <h1 className="my-4">{title}</h1>

            {avatar && <Avatar size={10} src={avatar} />}
            <Button
              size="lg"
              variant="outline-primary"
              href={`/member/${nickName}`}
            >
              {t('community_member')}
            </Button>
          </Col>

          <Col xs={12} sm={8}>
            <h2>{t('activity_footprint')}</h2>

            <ScrollList
              translator={i18n}
              store={this.store}
              filter={{ user: id }}
              renderList={() =>
                Object.entries(this.store.group).map(([activityId, list]) =>
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
