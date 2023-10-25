import { TableCellText, TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
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
  Stack,
} from 'react-bootstrap';

import {
  ActivityPeople,
  AgendaCard,
  DrawerNav,
} from '../../../components/Activity';
import PageHead from '../../../components/Layout/PageHead';
import type { ImageMarker } from '../../../components/Map/ListMap';
import { Activity, ActivityModel } from '../../../models/Activity';
import { AgendaModel } from '../../../models/Activity/Agenda';
import { Forum } from '../../../models/Activity/Forum';
import { Place } from '../../../models/Activity/Place';
import { blobURLOf } from '../../../models/Base';
import { i18n } from '../../../models/Base/Translation';
import {
  coordinateOf,
  normalizeTextArray,
  TableFormViewItem,
} from '../../api/lark/core';
import styles from './index.module.less';

const ListMap = dynamic(() => import('../../../components/Map/ListMap'), {
    ssr: false,
  }),
  { t } = i18n;

export const getServerSideProps = compose<
  { id: string },
  {
    activity: Activity;
    currentMeta: ActivityModel['currentMeta'];
    forums: Forum[];
    agendaGroup: AgendaModel['group'];
    places: Place[];
  }
>(cache(), errorLogger, translator(i18n), async ({ params }) => {
  const activityStore = new ActivityModel();

  const activity = await activityStore.getOne(params!.id, true);

  const [agendaGroup, forums, places] = await Promise.all([
    activityStore.currentAgenda!.getGroup(),
    activityStore.currentForum!.getAll(),
    activityStore.currentPlace!.getAll(),
  ]);
  const { currentMeta } = activityStore;

  return {
    props: JSON.parse(
      JSON.stringify({ activity, currentMeta, forums, agendaGroup, places }),
    ),
  };
});

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
      forms[0] && (
        <DropdownButton {...{ title, variant, disabled }}>
          {forms.map(({ name, shared_url }) => (
            <Dropdown.Item key={name} as="a" target="_blank" href={shared_url}>
              {name}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      )
    );
  }

  renderButtonBar() {
    const { endTime, personForms, agendaForms, fileForms, billForms } =
        this.props.currentMeta,
      { id, link } = this.props.activity;
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

  renderMap() {
    const { activity, places } = this.props;

    return (
      places[0] && (
        <>
          <h2 className="text-center pt-4 pb-3" id="map">
            {t('activity_map')}
          </h2>

          <ListMap
            style={{ height: 'calc(100vh - 10rem)' }}
            zoom={18}
            center={coordinateOf(activity.location)}
            markers={
              places
                .map(
                  ({ name, photos, location, forum }) =>
                    location && {
                      title: name,
                      summary: forum?.toString(),
                      image: photos && blobURLOf(photos),
                      position: coordinateOf(location),
                    },
                )
                .filter(Boolean) as ImageMarker[]
            }
          />
        </>
      )
    );
  }

  renderForumPeople(
    title: string,
    names: TableCellValue,
    avatars: TableCellValue,
    positions?: TableCellValue,
    organizations?: TableCellValue,
  ) {
    return (
      <div className="d-flex align-items-center gap-3 px-3">
        <h3 className="h6">{title}</h3>

        <ActivityPeople
          names={names as string[]}
          avatars={(avatars as TableCellValue[])?.map(file =>
            blobURLOf([file] as TableCellValue),
          )}
          positions={positions as string[]}
          organizations={organizations as string[]}
        />
      </div>
    );
  }

  renderForum = ({
    name,
    summary,
    volunteers,
    volunteerAvatars,
    producers,
    producerAvatars,
    producerPositions,
    producerOrganizations,
    location,
  }: Forum) => {
    const { activity, agendaGroup } = this.props;

    return (
      <section key={name as string}>
        <h2 className="mt-5 mb-3 text-center" id={name as string}>
          {name as string}
        </h2>
        {location && (
          <h4 className="mb-5 text-center">
            {normalizeTextArray(location as TableCellText[])[0]}
          </h4>
        )}
        <Row>
          <Col xl={{ offset: 2, span: 8 }} as="p" className="text-muted">
            {summary as string}
          </Col>
        </Row>
        <div className="d-flex justify-content-center">
          <div className="d-flex flex-column flex-sm-row align-items-center">
            {this.renderForumPeople(
              t('producer'),
              producers,
              producerAvatars,
              producerPositions,
              producerOrganizations,
            )}
            {(volunteers as string[])?.[0] &&
              this.renderForumPeople(
                t('volunteer'),
                volunteers,
                volunteerAvatars,
              )}
          </div>
        </div>

        <Row as="ol" className="list-unstyled g-4" xs={1} md={2}>
          {agendaGroup[name as string]?.map(agenda => (
            <Col as="li" key={agenda.id + ''}>
              <AgendaCard
                activityId={activity.id + ''}
                location={location + ''}
                {...agenda}
              />
            </Col>
          ))}
        </Row>
      </section>
    );
  };

  render() {
    const { activity, forums } = this.props;

    return (
      <>
        <PageHead title={activity.name + ''} />

        <header
          className={`d-flex flex-column align-items-center justify-content-around ${styles.header}`}
        >
          <img className={styles.img} src={blobURLOf(activity.image)} />
          <h1 className="visually-hidden" id="top">
            {activity.name as string}
          </h1>
        </header>

        {this.renderButtonBar()}

        <Stack
          className="justify-content-center"
          direction="horizontal"
          gap={3}
        >
          <Button variant="danger" href={`/activity/${activity.id}/gift`}>
            礼品墙
          </Button>
          <Button variant="info" href={`/activity/${activity.id}/volunteer`}>
            {t('volunteer')}
          </Button>
          <Button variant="secondary" href={`/activity/${activity.id}/finance`}>
            {t('financial_disclosure')}
          </Button>
          <Button variant="success" href="/search?keywords=收官">
            {t('previous_activities')}
          </Button>
        </Stack>

        <Container>
          {this.renderMap()}

          {forums.map(this.renderForum)}

          <DrawerNav />
        </Container>
      </>
    );
  }
}
