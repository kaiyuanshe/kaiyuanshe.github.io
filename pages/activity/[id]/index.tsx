import { Icon } from 'idea-react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { MouseEvent, PureComponent } from 'react';
import { Button, Col, Container, Nav, Offcanvas, Row } from 'react-bootstrap';
import { scrollTo, sleep } from 'web-utility';

import { AgendaCard } from '../../../components/Activity/Agenda/Card';
import PageHead from '../../../components/PageHead';
import { Activity, ActivityModel } from '../../../models/Activity';
import { AgendaModel } from '../../../models/Agenda';
import { blobURLOf } from '../../../models/Base';
import { i18n } from '../../../models/Translation';
import { withErrorLog } from '../../api/base';
import styles from './index.module.less';

export const getServerSideProps = withErrorLog<
  { id: string },
  {
    activity: Activity;
    currentMeta: ActivityModel['currentMeta'];
    agendaGroup: AgendaModel['group'];
  }
>(async ({ params }) => {
  const activityStore = new ActivityModel();

  const activity = await activityStore.getOne(params!.id);

  const agendaGroup = await activityStore.currentAgenda!.getGroup();

  const { currentMeta } = activityStore;

  return {
    props: JSON.parse(JSON.stringify({ activity, currentMeta, agendaGroup })),
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
    const { activity, agendaGroup } = this.props;

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
          {Object.entries(agendaGroup)
            .sort(([a], [b]) =>
              a === MainForumName ? -1 : b === MainForumName ? 1 : 0,
            )
            .map(([forum, agendas]) => (
              <section key={forum}>
                <h2 className="my-5 text-center" id={forum}>
                  {forum}
                </h2>
                <Row as="ol" className="list-unstyled g-4" xs={1} sm={2} md={3}>
                  {agendas.map(agenda => (
                    <Col as="li" key={agenda.id + ''}>
                      <AgendaCard {...agenda} />
                      <Button
                        href={`/activity/${activity.id}/agenda/${agenda.id}/invitation`}
                      >
                        {t('share')}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </section>
            ))}
        </Container>
      </>
    );
  }
}
