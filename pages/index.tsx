import { observer } from 'mobx-react';
import { Fragment, PureComponent } from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { Icon } from 'idea-react';

import PageHead from '../components/PageHead';
import ArticleCard from '../components/ArticleCard';
import { CityStatisticMap } from '../components/CityStatisticMap';

import { slogan } from './api/home';
import { isServer } from '../models/Base';
import activityStore from '../models/Activity';

@observer
export default class HomePage extends PureComponent {
  render() {
    return (
      <>
        <PageHead />

        <section className="py-5 text-center bg-primary">
          <Image src="https://kaiyuanshe.cn/image/Heart_of_Community.png" />
        </section>

        <Container>
          <section className="py-5 text-center">
            {slogan.map(({ title, items }) => (
              <Fragment key={title}>
                <h2 className="text-primary">{title}</h2>

                <ul className="list-unstyled text-secondary d-flex justify-content-center">
                  {items.map(({ icon, text }) => (
                    <li key={text} className="m-5">
                      <Icon name={icon} size={6} />
                      <h3>{text}</h3>
                    </li>
                  ))}
                </ul>
              </Fragment>
            ))}
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
            <h2 className="mb-4 text-center text-primary">活动地图</h2>

            {!isServer() && <CityStatisticMap store={activityStore} />}
          </section>
        </Container>
      </>
    );
  }
}
