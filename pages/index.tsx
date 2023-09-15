import { Icon } from 'idea-react';
import { observer } from 'mobx-react';
import { InferGetServerSidePropsType } from 'next';
import { cache, compose, errorLogger, translator } from 'next-ssr-middleware';
import { Fragment, PureComponent } from 'react';
import { Col, Container, Image, Row } from 'react-bootstrap';

import { ArticleListLayout } from '../components/Article/List';
import { LarkImage } from '../components/LarkImage';
import PageHead from '../components/Layout/PageHead';
import { CityStatisticMap } from '../components/Map/CityStatisticMap';
import activityStore from '../models/Activity';
import { i18n } from '../models/Base/Translation';
import { Department, DepartmentModel } from '../models/Personnel/Department';
import { Article, ArticleModel } from '../models/Product/Article';
import { slogan } from './api/home';
import { DefaultImage } from './api/lark/file/[id]';

export const getServerSideProps = compose<
  {},
  { articles: Article[]; projects: Department[] }
>(cache(), errorLogger, translator(i18n), async () => {
  const [articles, projects] = await Promise.all([
    new ArticleModel().getList({}, 1, 3),
    new DepartmentModel().getAll({ superior: '项目委员会' }),
  ]);

  return {
    props: JSON.parse(JSON.stringify({ articles, projects })),
  };
});

@observer
export default class HomePage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  renderProject = ({ id, name, logo = DefaultImage, link }: Department) => (
    <Col as="li" key={id + ''} className="position-relative">
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

  render() {
    const { articles, projects } = this.props,
      { t } = i18n;

    return (
      <>
        <PageHead />

        <section className="py-5 text-center bg-primary">
          <Image fluid src="/image/Heart_of_Community.png" alt="Head Image" />
        </section>

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
                        as="li"
                        className="h3"
                        xs={8}
                        sm={6}
                        md={8}
                        key={text}
                      >
                        {text}
                      </Col>
                    ) : (
                      <Col as="li" key={text}>
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
              {t('latest_news')}
            </h2>
            <p className="text-center text-muted">{t('slogan')}</p>
            <ArticleListLayout defaultData={articles} />
          </section>

          <section>
            <h2 className="my-5 text-center text-primary">
              {t('activity_map')}
            </h2>
            <CityStatisticMap store={activityStore} />
          </section>
        </Container>
      </>
    );
  }
}
