import { CheckEvent, User } from '@kaiyuanshe/kys-service';
import { TimeDistance } from 'idea-react';
import { observer } from 'mobx-react';
import { ScrollList } from 'mobx-restful-table';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';

import PageHead from '../../components/Layout/PageHead';
import { CheckEventModel } from '../../models/Activity/CheckEvent';
import { i18n } from '../../models/Base/Translation';
import userStore, { UserModel } from '../../models/Base/User';

export const getServerSideProps = compose<
  { uuid: string },
  { user: User; checkEvents: CheckEvent[] }
>(cache(), async ({ params: { uuid } = {} }) => {
  const user = await new UserModel().getOne(uuid!);

  const checkEvents = await new CheckEventModel().getList({ user: user.id });

  return { props: { user, checkEvents } };
});

@observer
export default class UserProfilePage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
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
    const title = `${user.mobilePhone || user.nickName}的开源护照`;

    return (
      <Container className="mt-5">
        <PageHead title={title} />
        <Row>
          <Col>
            <h1 className="my-4">{title}</h1>

            {userStore.session && (
              <Button
                variant="warning"
                target="_blank"
                href="https://ophapiv2-demo.authing.cn/u"
              >
                编辑个人信息
              </Button>
            )}
          </Col>

          <Col>
            <h2>活动足迹</h2>

            <ScrollList
              translator={i18n}
              store={this.store}
              filter={{ user: user.id }}
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
