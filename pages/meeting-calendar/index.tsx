import { Loading, MonthCalendar } from 'idea-react';
import { observer } from 'mobx-react';
import { compose, translator } from 'next-ssr-middleware';
import { Component } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { PageHead } from '../../components/Layout/PageHead';
import { i18n, t } from '../../models/Base/Translation';
import { MeetingModel } from '../../models/Governance/Meeting';

export const getServerSideProps = compose(translator(i18n));

@observer
export default class PublicMeetingPage extends Component {
  store = new MeetingModel();

  componentDidMount() {
    this.loadData();
  }

  loadData = (date?: Date) => {
    this.store.clear();
    this.store.getAll({ title: formatDate(date, 'YYYY-MM') });
  };

  render() {
    const { downloading, allItems } = this.store;

    return (
      <Container className="py-5">
        <PageHead title={t('meeting_calendar')} />

        <Breadcrumb>
          <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t('meeting_calendar')}</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className="pb-4">{t('meeting_calendar')}</h1>

        {downloading > 0 && <Loading />}

        <MonthCalendar
          className="text-center"
          value={allItems.map(({ title, startedAt, minutesURL }) => ({
            date: new Date(startedAt as number),
            content: title + '',
            link: minutesURL + '',
          }))}
          onChange={this.loadData}
        />
      </Container>
    );
  }
}
