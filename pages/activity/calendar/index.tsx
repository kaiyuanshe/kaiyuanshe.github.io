import { Loading, MonthCalendar } from 'idea-react';
import { observer } from 'mobx-react';
import { Component } from 'react';
import { Breadcrumb, Container } from 'react-bootstrap';

import { ArticleListLayout } from '../../../components/Article/List';
import { PageHead } from '../../../components/Layout/PageHead';
import { t } from '../../../models/Base/Translation';
import { CalendarSearchArticleModel } from '../../../models/Product/Article';

@observer
export default class CalendarPage extends Component {
  store = new CalendarSearchArticleModel();

  componentDidMount() {
    this.loadData();
  }

  loadData = (date?: Date) => this.store.getMonthList({ tags: '活动' }, date);

  render() {
    const { downloading, allItems } = this.store;

    return (
      <Container className="py-5">
        <PageHead title={t('activity_articles_calendar')} />
        <Breadcrumb>
          <Breadcrumb.Item href="/">{t('KaiYuanShe')}</Breadcrumb.Item>
          <Breadcrumb.Item href="/activity">{t('activity')}</Breadcrumb.Item>
          <Breadcrumb.Item active>
            {t('activity_articles_calendar')}
          </Breadcrumb.Item>
        </Breadcrumb>
        <h1 className="mb-5 text-center">{t('activity_articles_calendar')}</h1>

        {downloading > 0 && <Loading />}

        <MonthCalendar
          className="text-center"
          value={allItems.map(({ title, publishedAt, alias }) => ({
            date: new Date(publishedAt as number),
            content: title as string,
            link: `/article/${alias}`,
          }))}
          onChange={this.loadData}
        />
        {allItems[0] && (
          <section>
            <h2 className="text-center">{t('article')}</h2>

            <ArticleListLayout defaultData={allItems} />
          </section>
        )}
      </Container>
    );
  }
}
