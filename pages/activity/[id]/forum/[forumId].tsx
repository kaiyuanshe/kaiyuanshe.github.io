import { ShareBox, Timeline, TimelineEvent } from 'idea-react';
import { TableCellLocation, TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { cache, compose, errorLogger, router } from 'next-ssr-middleware';
import { QRCodeSVG } from 'qrcode.react';
import { Container } from 'react-bootstrap';

import { PageHead } from '../../../../components/Layout/PageHead';
import { Activity, ActivityModel } from '../../../../models/Activity';
import { Agenda } from '../../../../models/Activity/Agenda';
import { Forum } from '../../../../models/Activity/Forum';
import { i18n, I18nContext } from '../../../../models/Base/Translation';
import { API_Host } from '../../../../utility/configuration';
import { fileURLOf } from '../../../../utility/Lark';

interface ForumPageProps {
  activity: Activity;
  forum: Forum;
  agendas: Agenda[];
}

export const getServerSideProps = compose<Record<'id' | 'forumId', string>, ForumPageProps>(
  cache(),
  router,
  errorLogger,
  async ({ params: { id, forumId } = {} }) => {
    const activityStore = new ActivityModel();

    const activity = await activityStore.getOne(id!);
    const forum = await activityStore.currentForum!.getOne(forumId!);
    const agendas = await activityStore.currentAgenda!.getAll({
      forum: forum.name,
    });

    return {
      props: JSON.parse(JSON.stringify({ activity, forum, agendas })),
    };
  },
);

@observer
export default class ForumPage extends ObservedComponent<ForumPageProps, typeof i18n> {
  static contextType = I18nContext;

  sharedURL = `${API_Host}/activity/${this.props.activity.id}/forum/${this.props.forum.id}`;

  renderContent() {
    const { t } = this.observedContext,
      { activity, forum, agendas } = this.props,
      { sharedURL } = this;
    const { id: activityId, name, city, location, image, cardImage } = activity,
      { name: forumName, location: room } = forum;
    const events: TimelineEvent[] = agendas.map(
      ({ id, title, startTime, endTime, summary, mentors, mentorAvatars }) => ({
        title: title as string,
        summary: summary as string,
        time: [startTime as number, endTime as number],
        link: `/activity/${activityId}/agenda/${id}`,
        people: (mentors as string[]).map((name, index) => ({
          name,
          avatar: fileURLOf([(mentorAvatars as TableCellValue[])![index]!] as TableCellValue, true),
        })),
      }),
    );

    return (
      <Container
        className="d-flex flex-column justify-content-around align-items-center text-center py-5"
        style={{
          backgroundImage: `url(${fileURLOf(cardImage || image)})`,
          backgroundSize: 'cover',
        }}
      >
        <header className="d-flex flex-column align-items-center gap-4">
          <h1>{name as string}</h1>
          <h2>{forumName as string}</h2>

          <ul className="list-unstyled d-flex flex-column align-items-center gap-4">
            <li>🏙{city as string}</li>
            <li>🗺{(location as TableCellLocation)?.full_address}</li>
            <li>🚪{room as string}</li>
          </ul>
        </header>
        <section className="p-3">
          <Timeline events={events} timeFormat="YYYY-MM-DD HH:mm" />
        </section>
        <footer className="d-flex flex-column align-items-center gap-4">
          <QRCodeSVG value={sharedURL} />

          <div>{t('press_to_share')}</div>
        </footer>
      </Container>
    );
  }

  render() {
    const { activity, forum } = this.props,
      { sharedURL } = this;
    const { name } = activity,
      { name: forumName, summary } = forum;
    const pageTitle = `${forumName} - ${name}`;

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
