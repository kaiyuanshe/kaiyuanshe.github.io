import { TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { Component } from 'react';
import {
  Button,
  Col,
  Container,
  Dropdown,
  DropdownButton,
  DropdownButtonProps,
  Image,
  Row,
  Stack,
} from 'react-bootstrap';

import {
  ActivityPeople,
  AgendaCard,
  DrawerNav,
} from '../../../components/Activity';
import { LarkImage } from '../../../components/Base/LarkImage';
import { VerticalScrollableBox } from '../../../components/Base/VerticalScrollableBox';
import { PageHead } from '../../../components/Layout/PageHead';
import type { ImageMarker } from '../../../components/Map/ListMap';
import { Activity, ActivityModel } from '../../../models/Activity';
import { AgendaModel } from '../../../models/Activity/Agenda';
import { Forum } from '../../../models/Activity/Forum';
import { Place } from '../../../models/Activity/Place';
import { blobURLOf } from '../../../models/Base';
import { i18n, t } from '../../../models/Base/Translation';
import { coordinateOf, TableFormViewItem } from '../../api/lark/core';
import styles from './index.module.less';

const ListMap = dynamic(() => import('../../../components/Map/ListMap'), {
  ssr: false,
});

interface ActivityDetailPageProps {
  activity: Activity;
  currentMeta: ActivityModel['currentMeta'];
  forums: Forum[];
  agendaGroup: AgendaModel['group'];
  places: Place[];
}

export const getServerSideProps = compose<
  { id: string },
  ActivityDetailPageProps
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
export default class ActivityDetailPage extends Component<ActivityDetailPageProps> {
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
          t('volunteer_speaker_registration'),
          personForms,
          'primary',
          passed,
        )}
        {this.renderFormMenu(
          t('CFP_submission'),
          agendaForms,
          'success',
          passed,
        )}
        {this.renderFormMenu(t('CFP_file_submission'), fileForms, 'warning')}
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

  renderForumOrganization(
    name: TableCellValue,
    logo: TableCellValue,
    link: TableCellValue,
    summary: TableCellValue,
  ) {
    return (
      <Row
        className="align-items-center position-relative"
        style={{ maxWidth: '50%' }}
      >
        <Col xs={2}>{t('producer_organization')}</Col>
        <Col xs={2} className="text-center">
          <LarkImage
            rounded
            className="object-fit-contain"
            loading="lazy"
            src={logo}
            alt={name as string}
          />
        </Col>
        <Col xs={8}>
          <h3 className="h6">
            <a
              className="text-decoration-none stretched-link"
              target="_blank"
              href={link as string}
              rel="noreferrer"
            >
              {name as string}
            </a>
          </h3>
          <p
            className="text-muted overflow-hidden"
            style={{ maxHeight: '6rem' }}
          >
            {summary as string}
          </p>
        </Col>
      </Row>
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
    organization,
    organizationLogo,
    organizationLink,
    organizationSummary,
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
        <h2 className="my-5 mb-3 text-center" id={name as string}>
          {name as string}
        </h2>
        {location && <h4 className="text-center">{location as string}</h4>}
        <Row className="my-5">
          <Col xl={{ offset: 2, span: 8 }} as="p" className="text-muted">
            {summary as string}
          </Col>
        </Row>
        <div className="d-flex flex-wrap justify-content-around">
          {organization &&
            this.renderForumOrganization(
              organization,
              organizationLogo,
              organizationLink,
              organizationSummary,
            )}
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

        <Row as="ol" className="list-unstyled g-4" xs={1} md={2}>
          {agendaGroup[name as string]?.map(agenda => (
            <Col as="li" key={agenda.id + ''}>
              <AgendaCard activityId={activity.id + ''} {...agenda} />
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
          <VerticalScrollableBox>
            <Image
              className="mw-100"
              loading="lazy"
              src={blobURLOf(activity.image)}
            />
          </VerticalScrollableBox>
          <h1 className="visually-hidden" id="top">
            {activity.name as string}
          </h1>
        </header>

        {this.renderButtonBar()}

        <Stack
          className="justify-content-center flex-wrap"
          direction="horizontal"
          gap={3}
        >
          <Button
            className="text-nowrap"
            variant="danger"
            href={`/activity/${activity.id}/gift`}
          >
            {t('gift_wall')}
          </Button>
          <Button
            className="text-nowrap"
            variant="info"
            href={`/activity/${activity.id}/volunteer`}
          >
            {t('volunteer')}
          </Button>
          <Button
            className="text-nowrap"
            variant="secondary"
            href={`/activity/${activity.id}/finance`}
          >
            {t('financial_disclosure')}
          </Button>
          <Button
            className="text-nowrap"
            variant="success"
            href="/search?keywords=收官"
          >
            {t('previous_activities')}
          </Button>
          <Button
            className="text-nowrap"
            variant="success"
            href={`/activity/${activity.id}/charts`}
          >
            {t('activity_statistics')}
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
