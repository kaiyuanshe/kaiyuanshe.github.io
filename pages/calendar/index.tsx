import { MonthCalendar } from 'idea-react';
import { InferGetServerSidePropsType } from 'next';
import { compose, translator } from 'next-ssr-middleware';
import { PureComponent } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import { Article, SearchArticleModel } from '../../models/Product/Article';

export const getServerSideProps = compose<{}, { articles: Article[] }>(
  translator(i18n),
  async () => {
    const articles = await new SearchArticleModel().getList({
      tags: '活动',
    });
    return { props: { articles: JSON.parse(JSON.stringify(articles)) } };
  },
);

const { t } = i18n;

export default class Calendar extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  render() {
    const { articles } = this.props;

    const mergedList = articles.reduce(
      (accumulator, { title, publishedAt }) => {
        const date = new Date(Number(publishedAt!.valueOf()));
        const index = accumulator.findIndex(
          entry => entry.date.getDay() === date.getDay(),
        );
        index !== -1
          ? (accumulator[index].content += `\n${title}`)
          : accumulator.push({ date, content: title + '' });
        return accumulator;
      },
      [] as { date: Date; content: string }[],
    );

    return (
      <Container className="py-5 text-center">
        <PageHead title={t('activity_articles_calendar')} />
        <h1 className="mb-5 text-center">{t('activity_articles_calendar')}</h1>
        <MonthCalendar value={mergedList} />
      </Container>
    );
  }
}
