import { MonthCalendar } from 'idea-react';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { compose, translator } from 'next-ssr-middleware';
import { FC } from 'react';
import { Container } from 'react-bootstrap';

import PageHead from '../../components/Layout/PageHead';
import { i18n } from '../../models/Base/Translation';
import { SearchArticleModel } from '../../models/Product/Article';

interface MonthCalendarData {
  date: Date;
  content: string;
}

export const getServerSideProps = compose<{}, { list: MonthCalendarData[] }>(
  translator(i18n),
  async () => {
    const articles = await new SearchArticleModel().getList({
      tags: '活动',
    });

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
      [] as MonthCalendarData[],
    );
    return { props: { list: JSON.parse(JSON.stringify(mergedList)) } };
  },
);

const { t } = i18n;

const CalendarPage: FC<InferGetServerSidePropsType<typeof getServerSideProps>> =
  observer(({ list }) => (
    <Container className="py-5 text-center">
      <PageHead title={t('activity_articles_calendar')} />
      <h1 className="mb-5 text-center">{t('activity_articles_calendar')}</h1>
      <MonthCalendar value={list} />
    </Container>
  ));

export default CalendarPage;
