import { TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import {
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  DropdownButtonProps,
  Row,
} from 'react-bootstrap';

import { AgendaCard } from '../../../components/Activity/Agenda/Card';
import { DrawerNav } from '../../../components/Activity/DrawerNav';
import { ActivityPeople } from '../../../components/Activity/People';
import PageHead from '../../../components/PageHead';
import { Activity, ActivityModel } from '../../../models/Activity';
import { AgendaModel } from '../../../models/Agenda';
import { blobURLOf } from '../../../models/Base';
import { Forum } from '../../../models/Forum';
import { i18n } from '../../../models/Translation';
import { TableFormViewItem } from '../../api/lark/core';
import styles from './index.module.less';

export const getServerSideProps = compose<
  { id: string },
  {
    activity: Activity;
    currentMeta: ActivityModel['currentMeta'];
    agendaGroup: AgendaModel['group'];
    forums: Forum[];
  }
>(cache(), errorLogger, translator(i18n), async ({ params }) => {
  const activityStore = new ActivityModel();

  const activity = await activityStore.getOne(params!.id);

  const [agendaGroup, forums] = await Promise.all([
    activityStore.currentAgenda!.getGroup(),
    activityStore.currentForum!.getAll(),
  ]);
  const { currentMeta } = activityStore;

  return {
    props: JSON.parse(
      JSON.stringify({ activity, currentMeta, agendaGroup, forums }),
    ),
  };
});

const { t } = i18n;

@observer
export default class ActivityDetailPage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  renderFormMenu(
    title: string,
    forms: TableFormViewItem[],
    variant: DropdownButtonProps['variant'] = 'primary',
    disabled = false,
  ) {
    return (
      <DropdownButton {...{ title, variant, disabled }}>
        {forms.map(({ name, shared_url }) => (
          <Dropdown.Item key={name} as="a" target="_blank" href={shared_url}>
            {name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    );
  }

  renderButtonBar() {
    const { endTime, personForms, agendaForms, fileForms, billForms } =
        this.props.currentMeta,
      { link } = this.props.activity;
    const passed = +new Date(+endTime!) <= Date.now();

    return (
      <div className="d-flex flex-wrap justify-content-center gap-3 my-3">
        {this.renderFormMenu(
          t('register_volunteer'),
          personForms,
          'primary',
          passed,
        )}
        {this.renderFormMenu(
          t('submit_agenda'),
          agendaForms,
          'success',
          passed,
        )}
        {this.renderFormMenu(t('submit_agenda_file'), fileForms, 'warning')}
        {this.renderFormMenu(t('reimbursement_application'), billForms, 'info')}
        {link && (
          <Button variant="danger" target="_blank" href={link as string}>
            {t('participant_registration')}
          </Button>
        )}
      </div>
    );
  }

  renderForumPeople(
    title: string,
    names: TableCellValue,
    avatars: TableCellValue,
    positions?: TableCellValue,
  ) {
    return (
      <div className="d-flex align-items-center px-5">
        <h3 className="h6">{title}</h3>
        <ActivityPeople
          names={names as string[]}
          avatars={(avatars as TableCellValue[])?.map(file =>
            blobURLOf([file] as TableCellValue),
          )}
          positions={positions as string[]}
        />
      </div>
    );
  }

  render() {
    const { activity, agendaGroup, forums } = this.props;

    return (
      <>
        <PageHead title={activity.name + ''} />

        <header
          className={`d-flex flex-column align-items-center justify-content-around ${styles.header}`}
          style={{
            backgroundImage: `url(${JSON.stringify(
              blobURLOf(activity.image),
            )})`,
          }}
        >
          <h1 className="visually-hidden">{activity.name}</h1>
        </header>

        {this.renderButtonBar()}

        <Container>
          {forums.map(
            ({
              name,
              summary,
              volunteers,
              volunteerAvatars,
              producers,
              producerAvatars,
              producerPositions,
            }) => (
              <section key={name as string}>
                <h2 className="my-5 text-center" id={name as string}>
                  {name}
                </h2>
                <p className="text-muted">{summary}</p>

                <div className="d-flex justify-content-center">
                  <div className="d-flex align-items-center px-5">
                    {this.renderForumPeople(
                      t('producer'),
                      producers,
                      producerAvatars,
                      producerPositions,
                    )}
                    {(volunteers as string[])?.[0] &&
                      this.renderForumPeople(
                        t('volunteer'),
                        volunteers,
                        volunteerAvatars,
                      )}
                  </div>
                </div>

                <Row as="ol" className="list-unstyled g-4" xs={1} sm={2} md={3}>
                  {agendaGroup[name as string]?.map(agenda => (
                    <Col as="li" key={agenda.id + ''}>
                      <AgendaCard
                        activityId={activity.id + ''}
                        location={activity.location + ''}
                        {...agenda}
                      />
                    </Col>
                  ))}
                </Row>
              </section>
            ),
          )}
          <DrawerNav />
        </Container>
      </>
    );
  }
}
