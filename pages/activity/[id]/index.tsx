import { Icon } from 'idea-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { JSX, MouseEvent, PureComponent, ReactNode } from 'react';
import { Button, Col, Container, Nav, Offcanvas, Row } from 'react-bootstrap';
import { scrollTo, sleep } from 'web-utility';

import { AgendaCard } from '../../../components/Activity/Agenda/Card';
import PageHead from '../../../components/PageHead';
import { Activity, ActivityModel } from '../../../models/Activity';
import { Agenda, AgendaModel } from '../../../models/Agenda';
import { Forum } from '../../../models/Forum';

import { blobURLOf } from '../../../models/Base';
import { i18n } from '../../../models/Translation';
import { withErrorLog } from '../../api/base';
import styles from './index.module.less';
import { Staff } from '../../../components/Activity/Staff';

export const getServerSideProps = withErrorLog<
  { id: string },
  {
    activity: Activity;
    currentMeta: ActivityModel['currentMeta'];
    agendaGroup: AgendaModel['group'];
    forums: Forum[];
  }
>(async ({ params }) => {
  const activityStore = new ActivityModel();

  const activity = await activityStore.getOne(params!.id);

  const agendaGroup = await activityStore.currentAgenda!.getGroup();

  const { currentMeta } = activityStore;

  const forums = await activityStore.currentForum!.getAll();

  return {
    props: JSON.parse(
      JSON.stringify({ activity, currentMeta, agendaGroup, forums }),
    ),
  };
});

const { t } = i18n;

const MainForumName = '主论坛';

@observer
export default class ActivityDetailPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  @observable
  showDrawer = false;

  closeDrawer = async () => {
    var { scrollTop } = document.scrollingElement || {};

    do {
      await sleep(0.1);

      if (scrollTop === document.scrollingElement?.scrollTop) {
        this.showDrawer = false;
        break;
      }
      scrollTop = document.scrollingElement?.scrollTop;
    } while (true);
  };

  scrollTo = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    scrollTo(event.currentTarget.getAttribute('href')!);

    this.closeDrawer();
  };

  renderButtonBar() {
    const { startTime, personForm, agendaForm, fileForm } =
      this.props.currentMeta;
    const passed = +new Date(+startTime!) <= Date.now();

    return (
      <div className="d-flex justify-content-center gap-3 my-3">
        {personForm && (
          <Button
            variant="success"
            target="_blank"
            href={personForm}
            disabled={passed}
          >
            {t('register_volunteer')}
          </Button>
        )}
        {agendaForm && (
          <Button target="_blank" href={agendaForm} disabled={passed}>
            {t('submit_agenda')}
          </Button>
        )}
        {fileForm && (
          <Button
            variant="warning"
            target="_blank"
            href={fileForm}
            disabled={passed}
          >
            {t('submit_agenda_file')}
          </Button>
        )}
      </div>
    );
  }

  renderDrawer() {
    const { showDrawer } = this,
      { agendaGroup } = this.props;

    return (
      <>
        <div className="fixed-bottom p-3">
          <Button onClick={() => (this.showDrawer = true)}>
            <Icon name="layout-text-sidebar" />
          </Button>
        </div>

        <Offcanvas
          style={{ width: 'max-content' }}
          show={showDrawer}
          onHide={this.closeDrawer}
        >
          <Offcanvas.Body>
            <Nav className="flex-column">
              {Object.keys(agendaGroup)
                .sort((a, b) =>
                  a === MainForumName ? -1 : b === MainForumName ? 1 : 0,
                )
                .map(forum => (
                  <Nav.Link
                    key={forum}
                    href={`#${forum}`}
                    onClick={this.scrollTo}
                  >
                    {forum}
                  </Nav.Link>
                ))}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }

  render() {
    const { activity, agendaGroup, forums } = this.props;

    const combinedInfo = forums.reduce((acc, item) => {
      const { name, producers, producerAvatars, volunteers, volunteerAvatars } =
        item;
      if (name in acc) {
        acc[name].producers = producers;
        acc[name].producerAvatars = producerAvatars;
        acc[name].volunteers = volunteers;
        acc[name].volunteerAvatars = volunteerAvatars;
      }
      return acc;
    }, agendaGroup as Record<string, Agenda[] | any>);

    return (
      <>
        <PageHead title={activity.name + ''} />

        <header
          className={`d-flex flex-column align-items-center justify-content-around ${styles.header}`}
          style={{
            backgroundImage: `url(${blobURLOf(activity.image)})`,
          }}
        >
          <h1 className="visually-hidden">{activity.name}</h1>
        </header>

        {this.renderButtonBar()}
        {this.renderDrawer()}

        <Container>
          {Object.entries(combinedInfo)
            .sort(([a], [b]) =>
              a === MainForumName ? -1 : b === MainForumName ? 1 : 0,
            )
            .map(([forum, agendas]) => {
              const {
                producers,
                producerAvatars,
                volunteers,
                volunteerAvatars,
              } = agendas;

              return (
                <section key={forum}>
                  <h2 className="my-5 text-center" id={forum}>
                    {forum}
                  </h2>

                  <Staff
                    producerNames={producers as string[]}
                    producerAvatars={producerAvatars}
                    volunteerNames={volunteers as string[]}
                    volunteerAvatars={volunteerAvatars}
                  />

                  {forums.forEach(item => {
                    if (item.name === forum) {
                      return <h3>{item.producers}</h3>;
                    }
                  })}
                  <Row
                    as="ol"
                    className="list-unstyled g-4"
                    xs={1}
                    sm={2}
                    md={3}
                  >
                    {agendas.map(
                      (
                        agenda: JSX.IntrinsicAttributes &
                          Agenda & { children?: ReactNode },
                      ) => (
                        <Col as="li" key={agenda.id + ''}>
                          <AgendaCard {...agenda} />
                        </Col>
                      ),
                    )}
                  </Row>
                </section>
              );
            })}
        </Container>
      </>
    );
  }
}
