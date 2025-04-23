import { Icon } from 'idea-react';
import { TableCellValue } from 'mobx-lark';
import { observer } from 'mobx-react';
import { compose, errorLogger, translator } from 'next-ssr-middleware';
import { Component, Fragment } from 'react';
import { Carousel, Col, Container, Image, Row } from 'react-bootstrap';

import { ActivityListLayout } from '../components/Activity/List';
import { ArticleListLayout } from '../components/Article/List';
import { LarkImage } from '../components/Base/LarkImage';
import { PageHead } from '../components/Layout/PageHead';
import { CityStatisticMap } from '../components/Map/CityStatisticMap';
import { Activity, ActivityModel } from '../models/Activity';
import { CheckEventModel } from '../models/Activity/CheckEvent';
import { i18n, t } from '../models/Base/Translation';
import { COMMUNITY_BASE_ID } from '../models/Community';
import {
  OrganizationStatistic,
  OrganizationStatisticModel,
  OSC_CITY_STATISTIC_TABLE_ID,
} from '../models/Community/Organization';
import { Department, DepartmentModel } from '../models/Personnel/Department';
import { Article, ArticleModel } from '../models/Product/Article';
import styles from '../styles/Home.module.less';
import { solidCache } from './api/base';
import { slogan } from './api/home';
import { DefaultImage } from './api/lark/file/[id]';

interface HomePageProps {
  articles: Article[];
  activities: Activity[];
  hotActivities: Activity[];
  cityStatistic: OrganizationStatistic['city'];
  projects: Department[];
}

export const getServerSideProps = compose<{}, HomePageProps>(
  solidCache,
  errorLogger,
  translator(i18n),
  async () => {
    const [articles, activities, hotActivities, cityStatistic, projects] =
      await Promise.all([
        new ArticleModel().getList({}, 1, 3),
        new ActivityModel().getList({}, 1, 3),
        new CheckEventModel().getHotActivity(),
        new OrganizationStatisticModel(
          COMMUNITY_BASE_ID,
          OSC_CITY_STATISTIC_TABLE_ID,
        ).countAll(['activityCount']),
        new DepartmentModel().getAll({ superior: '项目委员会' }),
      ]);

    return {
      props: JSON.parse(
        JSON.stringify({
          articles,
          activities,
          hotActivities,
          cityStatistic,
          projects,
        }),
      ),
    };
  },
);

@observer
export default class HomePage extends Component<HomePageProps> {
  renderProject = ({ id, name, logo = DefaultImage, link }: Department) => (
    <Col key={id + ''} as="li" className="position-relative">
      <LarkImage style={{ height: '8rem' }} alt={name as string} src={logo} />
      <a
        className="d-block text-decoration-none text-dark h5 stretched-link mt-3"
        target="_blank"
        href={link + ''}
        rel="noreferrer"
      >
        {(name as string).replace('项目组', '')}
      </a>
    </Col>
  );

  renderCarousel = ({
    id,
    image,
    link,
    linkText,
  }: Record<'id' | 'image' | 'link' | 'linkText', TableCellValue>) => (
    <Carousel.Item key={id + ''} className="position-relative">
      <a
        className="stretched-link text-decoration-none text-dark"
        href={link + ''}
        target={(link + '').startsWith('http') ? '_blank' : '_self'}
        rel="noreferrer"
      >
        <LarkImage className="object-fit-contain" src={image} fluid />
      </a>

      <Carousel.Caption as="h3" className="bg-primary opacity-50">
        {linkText as string}
      </Carousel.Caption>
    </Carousel.Item>
  );

  render() {
    const { articles, activities, hotActivities, cityStatistic, projects } =
      this.props;

    return (
      <>
        <PageHead />

        <header className={`text-center bg-primary ${styles.banner}`}>
          <Carousel>
            <Carousel.Item>
              <Image
                className="object-fit-contain py-5"
                src="/image/Heart_of_Community.png"
                alt="Head Image"
                fluid
              />
            </Carousel.Item>

            {activities.map(({ name: linkText, ...activity }) =>
              this.renderCarousel({
                ...activity,
                link: ActivityModel.getLink(activity),
                linkText,
              }),
            )}

            {articles.map(({ alias, title: linkText, ...article }) =>
              this.renderCarousel({
                ...article,
                link: `/article/${alias}`,
                linkText,
              }),
            )}
          </Carousel>
        </header>

        <Container>
          <section className="text-center">
            {slogan().flatMap(({ title, items }) => (
              <Fragment key={title}>
                <h2 className="my-5 text-primary">{title}</h2>

                <Row
                  as="ul"
                  className="list-unstyled mx-0 g-5 justify-content-center text-secondary"
                  xs={2}
                  sm={2}
                  md={4}
                >
                  {items.map(({ icon, text }) =>
                    text === t('our_vision_content') ? (
                      <Col
                        key={text}
                        as="li"
                        className="h3"
                        xs={8}
                        sm={6}
                        md={8}
                      >
                        {text}
                      </Col>
                    ) : (
                      <Col key={text} as="li">
                        <Icon name={icon} size={6} />
                        <div className="h3">{text}</div>
                      </Col>
                    ),
                  )}
                </Row>
              </Fragment>
            ))}
          </section>

          <section className="text-center">
            <h2 className="my-5 text-primary">{t('our_projects')}</h2>

            <Row
              as="ul"
              className="list-unstyled mx-0 g-5 justify-content-center"
              xs={2}
              sm={2}
              md={4}
            >
              {projects.map(this.renderProject)}
            </Row>
          </section>

          <section>
            <h2 className="my-5 text-center text-primary">
              {t('latest_activity')}
            </h2>
            <ActivityListLayout defaultData={activities} />
          </section>
          <section>
            <h2 className="my-5 text-center text-primary">热门活动</h2>
            <ActivityListLayout defaultData={hotActivities} />
          </section>

          <section>
            <h2 className="my-5 text-center text-primary">
              {t('latest_news')}
            </h2>
            <p className="text-center text-muted">{t('slogan')}</p>
            <ArticleListLayout defaultData={articles} />
          </section>

          <section>
            <h2 className="my-5 text-center text-primary">
              {t('activity_map')}
            </h2>
            <CityStatisticMap data={cityStatistic} />
          </section>
        </Container>
      </>
    );
  }
}
