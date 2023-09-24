import { Loading, MonthCalendar, OverlayBox, text2color } from 'idea-react';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Badge, Container } from 'react-bootstrap';

import { ArticleListLayout } from '../../components/Article/List';
import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import {
  Article,
  CalendarSearchArticleModel,
} from '../../models/Product/Article';

const { t } = i18n;

@observer
export default class CalendarPage extends PureComponent {
  store = new CalendarSearchArticleModel();
  componentDidMount() {
    this.loadData();
  }
  loadData = (date?: Date) => this.store.getMonthList({ tags: '活动' }, date);

  render() {
    const { downloading, allItems } = this.store;
    return (
      <Container className="py-5 text-center">
        <PageHead title={t('activity_articles_calendar')} />
        <h1 className="mb-5 text-center">{t('activity_articles_calendar')}</h1>
        {downloading > 0 && <Loading />}
        <MonthCalendar
          value={allItems.map(({ title, publishedAt, alias }) => ({
            date: new Date(publishedAt as number),
            content: (
              <OverlayBox title={title}>
                <Badge
                  className="d-inline-block text-truncate w-100"
                  bg={text2color(title + '', ['light'])}
                  as="a"
                  href={`/article/${alias}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {title}
                </Badge>
              </OverlayBox>
            ),
          }))}
          onChange={this.loadData}
        />
        {allItems[0] && (
          <section>
            <h2>{t('article')}</h2>
            <ArticleListLayout defaultData={allItems} />
          </section>
        )}
      </Container>
    );
  }
}
