import { text2color } from 'idea-react';
import { TableCellLocation, TableCellValue } from 'mobx-lark';
import { compose, errorLogger, router } from 'next-ssr-middleware';
import { QRCodeSVG } from 'qrcode.react';
import { PureComponent } from 'react';
import { Badge, Container } from 'react-bootstrap';

import { ActivityPeople } from '../../../../../components/Activity/People';
import { ShareBox } from '../../../../../components/Base/ShareBox';
import PageHead from '../../../../../components/Layout/PageHead';
import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Activity/Agenda';
import { API_Host, blobURLOf } from '../../../../../models/Base';
import { i18n } from '../../../../../models/Base/Translation';
import { fileURLOf } from '../../../../api/lark/file/[id]';
import styles from './invitation.module.less';

const { t } = i18n;

interface InvitationPageProps {
  activity: Activity;
  agenda: Agenda;
}

export const getServerSideProps = compose<
  Record<'id' | 'agendaId', string>,
  InvitationPageProps
>(router, errorLogger, async ({ params: { id, agendaId } = {} }) => {
  const activityStore = new ActivityModel();

  const activity = await activityStore.getOne(id!);

  const agenda = await activityStore.currentAgenda!.getOne(agendaId!);

  return {
    props: JSON.parse(JSON.stringify({ activity, agenda })),
  };
});

export default class InvitationPage extends PureComponent<InvitationPageProps> {
  sharedURL = `${API_Host}/activity/${this.props.activity.id}/agenda/${this.props.agenda.id}`;

  renderContent() {
    const { activity, agenda } = this.props,
      { sharedURL } = this;
    const { name, city, location, image, cardImage } = activity,
      {
        type,
        startTime,
        endTime,
        title,
        mentors,
        mentorAvatars,
        mentorPositions,
        mentorOrganizations,
      } = agenda;

    return (
      <Container
        className={`d-flex flex-column justify-content-around align-items-center text-center ${styles.invitationBG}`}
        style={{
          backgroundImage: `url(${fileURLOf(cardImage || image)})`,
        }}
      >
        <header className="d-flex flex-column align-items-center gap-4">
          <h1>{name as string}</h1>

          <ul className="list-unstyled d-flex flex-column align-items-center gap-4">
            <li>🏙{city as string}</li>
            <li>🗺{(location as TableCellLocation)?.full_address}</li>
          </ul>
        </header>
        <section className="d-flex flex-column align-items-center gap-4">
          <h2 className="d-flex flex-wrap justify-content-center align-items-center gap-2 text-start">
            <Badge bg={text2color(type + '', ['light'])}>{type + ''}</Badge>

            {title as string}
          </h2>

          <ul className="list-unstyled d-flex flex-column align-items-center gap-4">
            <li>
              <ActivityPeople
                names={mentors as string[]}
                avatars={(mentorAvatars as TableCellValue[]).map(file =>
                  blobURLOf([file] as TableCellValue),
                )}
                positions={mentorPositions as string[]}
                organizations={mentorOrganizations as string[]}
              />
            </li>
            <li>
              🕒 {new Date(+startTime!).toLocaleString()} ~{' '}
              {new Date(+endTime!).toLocaleString()}
            </li>
          </ul>
        </section>
        <footer className="d-flex flex-column align-items-center gap-4">
          <QRCodeSVG value={sharedURL} />

          <div>{t('press_to_share')}</div>
        </footer>
      </Container>
    );
  }

  render() {
    const { activity, agenda } = this.props,
      { sharedURL } = this;
    const { name } = activity,
      { title, summary } = agenda;

    return (
      <>
        <PageHead title={`${title} - ${name}`} />

        <ShareBox
          title={title as string}
          text={summary as string}
          url={sharedURL}
        >
          {this.renderContent()}
        </ShareBox>
      </>
    );
  }
}
