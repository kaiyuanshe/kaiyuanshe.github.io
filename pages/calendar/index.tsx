import { MonthCalendar, OverlayBox } from 'idea-react';
import { makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import {
  Article,
  CalendarSearchArticleModel,
} from '../../models/Product/Article';

const { t } = i18n;

@observer
export default class CalendarPage extends PureComponent {
  constructor(props: {}) {
    super(props);
    makeObservable(this);
  }

  @observable
  currentMonthList: Article[] = [];

  store = new CalendarSearchArticleModel();

  componentDidMount() {
    this.loadData(new Date());
  }

  async loadData(date: Date) {
    this.currentMonthList = await this.store.getMonthList(
      { tag: '活动' },
      date,
    );
  }

  render() {
    const { currentMonthList } = this;
    return (
      <Container className="py-5 text-center">
        <PageHead title={t('activity_articles_calendar')} />
        <h1 className="mb-5 text-center">{t('activity_articles_calendar')}</h1>
        <MonthCalendar
          value={currentMonthList.map(({ id, title, publishedAt, link }) => ({
            date: new Date(publishedAt as number),
            content: (
              <OverlayBox key={id + ''} title={title}>
                <a
                  className="container d-inline-block text-truncate"
                  href={link + ''}
                  target="_blank"
                  rel="noreferrer"
                >
                  {title}
                </a>
              </OverlayBox>
            ),
          }))}
          onChange={date => this.loadData(date)}
        />
      </Container>
    );
  }
}
