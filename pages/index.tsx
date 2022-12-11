import { InferGetServerSidePropsType } from 'next';
import { textJoin } from 'mobx-i18n';
import { observer } from 'mobx-react';
import { Fragment, PureComponent } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Icon } from 'idea-react';

import PageHead from '../components/PageHead';
import { ArticleListLayout } from '../components/Article/List';
import { CityStatisticMap } from '../components/CityStatisticMap';

import { i18n } from '../models/Translation';
import articleStore, { Article } from '../models/Article';
import groupStore, { Group } from '../models/Group';
import activityStore from '../models/Activity';

import { withTranslation } from './api/base';
import { slogan } from './api/home';
import { DefaultImage, fileURLOf } from './api/lark/file/[id]';


export const getServerSideProps = withTranslation(async () => {
  const articles = await articleStore.getList({}, 1, 3),
    projects = await groupStore.getAll({ type: '项目' });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) as Article[],
      projects: JSON.parse(JSON.stringify(projects)) as Group[],
    },
  };
});

@observer
export default class HomePage extends PureComponent<
  InferGetServerSidePropsType<typeof getServerSideProps>
> {
  renderProject = ({ id, name, logo = DefaultImage, link }: Group) => (
    <Col as="li" key={id + ''} className="position-relative">
      <Image
        style={{ height: '8rem' }}
        loading="lazy"
        alt="logo"
        src={fileURLOf(logo)}
      />
      <a
        className="d-block text-decoration-none text-dark h5 stretched-link mt-3"
        target="_blank"
        href={link + ''}
        rel="noreferrer"
      >
        {name}
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
          <Image
            fluid
            src="https://kaiyuanshe.cn/image/Heart_of_Community.png"
          />
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
                  {items.map(({ icon, text }) => (
                    <Col as="li" key={text}>
                      <Icon name={icon} size={6} />
                      <div className="h3">{text}</div>
                    </Col>
                  ))}
                </Row>
              </Fragment>
            ))}
          </section>

          <section className="text-center">
            <h2 className="my-5 text-primary">
              {textJoin(t('self_developed'), t('open_source'), t('project'))}
            </h2>

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
            <h2 className="text-center text-primary">{t('latest_news')}</h2>
            <p className="text-center text-muted">{t('slogan')}</p>
            <ArticleListLayout data={articles} />
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
