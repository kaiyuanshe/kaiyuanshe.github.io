import { ShareBox, text2color } from 'idea-react';
import { TableCellLocation } from 'mobx-lark';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { cache, compose, errorLogger, router } from 'next-ssr-middleware';
import { QRCodeSVG } from 'qrcode.react';
import { Badge, Container } from 'react-bootstrap';

import { ActivityPeople } from '../../../../../components/Activity/People';
import { PageHead } from '../../../../../components/Layout/PageHead';
import { Activity, ActivityModel } from '../../../../../models/Activity';
import { Agenda } from '../../../../../models/Activity/Agenda';
import { i18n, I18nContext } from '../../../../../models/Base/Translation';
import { API_Host } from '../../../../../utility/configuration';
import { fileURLOf } from '../../../../../utility/Lark';
import styles from './invitation.module.less';

interface InvitationPageProps {
  activity: Activity;
  agenda: Agenda;
}

export const getServerSideProps = compose<Record<'id' | 'agendaId', string>, InvitationPageProps>(
  cache(),
  router,
  errorLogger,
  async ({ params: { id, agendaId } = {} }) => {
    const activityStore = new ActivityModel();

    const activity = await activityStore.getOne(id!);

    const agenda = await activityStore.currentAgenda!.getOne(agendaId!);

    return {
      props: JSON.parse(JSON.stringify({ activity, agenda })),
    };
  },
);

@observer
export default class InvitationPage extends ObservedComponent<InvitationPageProps, typeof i18n> {
  static contextType = I18nContext;

  sharedURL = `${API_Host}/activity/${this.props.activity.id}/agenda/${this.props.agenda.id}`;

  renderContent() {
    const { t } = this.observedContext,
      { activity, agenda } = this.props,
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
                avatars={mentorAvatars}
                positions={mentorPositions as string[]}
                organizations={mentorOrganizations as string[]}
              />
            </li>
            <li>
              🕒 {new Date(+startTime!).toLocaleString()} ~ {new Date(+endTime!).toLocaleString()}
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
    const pageTitle = `${title} - ${name}`;

    return (
      <>
        <PageHead title={pageTitle} />

        <ShareBox title={pageTitle} text={summary as string} url={sharedURL}>
          {this.renderContent()}
        </ShareBox>
      </>
    );
  }
}
