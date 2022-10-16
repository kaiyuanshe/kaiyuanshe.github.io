import { InferGetStaticPropsType } from 'next';
import { Fragment, PureComponent } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Icon } from 'idea-react';

import PageHead from '../components/PageHead';
import ArticleCard from '../components/ArticleCard';
import { CityStatisticMap } from '../components/CityStatisticMap';

import { isServer } from '../models/Base';
import groupStore, { Group } from '../models/Group';
import activityStore from '../models/Activity';
import { slogan } from './api/home';
import { DefaultImage, fileURLOf } from './api/lark/file/[id]';

export async function getStaticProps() {
  const projects = await groupStore.getAll({ type: '项目' });

  return { props: { projects: JSON.parse(JSON.stringify(projects)) } };
}

export default class HomePage extends PureComponent<
  InferGetStaticPropsType<typeof getStaticProps>
> {
  renderProject = ({ id, name, logo = DefaultImage, link }: Group) => (
    <Col as="li" key={id + ''} className="position-relative">
      <Image style={{ height: '8rem' }} loading="lazy" src={fileURLOf(logo)} />
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
    const { projects } = this.props;

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
            {slogan.map(({ title, items }) => (
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
            <h2 className="my-5 text-primary">自研开源项目</h2>

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

          {/* <section>
            <h2 className="text-center text-primary">最新动态</h2>
            <p className="text-center text-muted">
              身体力行地践行开源，咱们华人有力量！
            </p>
            <Row as="section" xs={1} sm={2} xl={3} xxl={4} className="g-3 my-4">
              {articles.map(item => (
                <Col key={item.id}>
                  <ArticleCard className="h-100" {...item} />
                </Col>
              ))}
            </Row>
          </section> */}

          <section>
            <h2 className="my-5 text-center text-primary">活动地图</h2>

            {!isServer() && <CityStatisticMap store={activityStore} />}
          </section>
        </Container>
      </>
    );
  }
}
