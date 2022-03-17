import { groupBy } from 'lodash';
import { PureComponent } from 'react';
import { Container, Row, Col, Button, Spinner, Card } from 'react-bootstrap';

import AMapChart, { AMapChartProps } from '../../components/AMapChart';
import { call } from '../api/base';
import { city_coordinates } from '../api/city';
import { Organization } from '../api/organization';

interface State extends AMapChartProps {
  loading: boolean;
  currentCity?: string;
  orgs: Organization[];
}

export default class OpenSourceMap extends PureComponent<{}, State> {
  state: Readonly<State> = {
    loading: true,
    list: [],
    orgs: [],
  };

  async componentDidMount() {
    const orgs = await call<Organization[]>('organization');

    const list = Object.entries(groupBy(orgs, 'city'))
      .map(([city, list]) => {
        const point = city_coordinates[city! as string];

        if (point)
          return {
            name: city,
            value: [...point, list.length],
          };
      })
      .filter(Boolean) as AMapChartProps['list'];

    this.setState({ loading: false, list, orgs });
  }

  render() {
    const { loading, currentCity, list, orgs } = this.state;

    return (
      <Container className="text-center">
        <header className="d-flex justify-content-between align-items-center">
          <h1 className="my-4">中国开源地图</h1>
          <div>
            <Button
              size="sm"
              target="_blank"
              href="https://wenjuan.feishu.cn/m/cfm?t=svSC7zcg2AAi-yjdo"
            >
              + 加入开源地图
            </Button>
          </div>
        </header>

        {loading ? (
          <Spinner
            className="my-4"
            animation="grow"
            variant="primary"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <AMapChart
            list={list}
            onSelect={({ name }) => this.setState({ currentCity: name })}
          />
        )}
        <Row xs={1} sm={2} md={3} lg={4} className="g-4 my-4">
          {orgs.map(
            ({ name, logos, city, summary }) =>
              (!currentCity || currentCity === city) && (
                <Col key={name as string}>
                  <Card className="text-start">
                    <Card.Img
                      variant="top"
                      src={
                        (logos instanceof Array
                          ? logos[0]?.link
                          : logos && logos.split(/\s+/)[0]) || ''
                      }
                    />
                    <Card.Body>
                      <Card.Title>{name}</Card.Title>
                      <Card.Text>{summary?.slice(0, 100)}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ),
          )}
        </Row>
      </Container>
    );
  }
}
