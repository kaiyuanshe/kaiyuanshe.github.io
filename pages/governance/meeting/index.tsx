import { Loading, MonthCalendar } from 'idea-react';
import { observer } from 'mobx-react';
import { ObservedComponent } from 'mobx-react-helper';
import { Breadcrumb, Container } from 'react-bootstrap';
import { formatDate } from 'web-utility';

import { PageHead } from '../../../components/Layout/PageHead';
import { i18n, I18nContext } from '../../../models/Base/Translation';
import { MeetingModel } from '../../../models/Governance/Meeting';

@observer
export default class PublicMeetingPage extends ObservedComponent<{}, typeof i18n> {
  static contextType = I18nContext;

  store = new MeetingModel();

  componentDidMount() {
    this.loadData();
  }

  loadData = (date?: Date) => {
    this.store.clear();
    this.store.getAll({ title: formatDate(date, 'YYYY-MM') });
  };

  render() {
    const { t } = this.observedContext,
      { downloading, allItems } = this.store;

    return (
      <Container className="py-5">
        <PageHead title={t('meeting_calendar')} />

        <Breadcrumb>
          <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
          <Breadcrumb.Item>{t('open_governance')}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t('meeting_calendar')}</Breadcrumb.Item>
        </Breadcrumb>

        <h1 className="pb-4">{t('meeting_calendar')}</h1>

        {downloading > 0 && <Loading />}

        <MonthCalendar
          className="text-center"
          value={allItems.map(({ id, title, startedAt }) => ({
            date: new Date(startedAt as number),
            content: title + '',
            link: `/governance/meeting/${id}`,
          }))}
          onChange={this.loadData}
        />
      </Container>
    );
  }
}
