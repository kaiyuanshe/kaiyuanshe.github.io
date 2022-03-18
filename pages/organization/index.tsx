import { groupBy } from 'lodash';
import { PureComponent } from 'react';
import {
  Container,
  Row,
  Col,
  Badge,
  Button,
  Spinner,
  Card,
} from 'react-bootstrap';
import { Icon } from 'idea-react';
import { Amap, Marker } from '@amap/amap-react';

import { text2color } from '../../components/utility';
import PageHead from '../../components/PageHead';
import { call } from '../api/base';
import { Organization } from '../api/organization';

interface MapPoint {
  name: string;
  value: number[];
}

interface State {
  loading: boolean;
  currentCity?: string;
  list: MapPoint[];
  orgs: Organization[];
}

export default class OpenSourceMap extends PureComponent<{}, State> {
  state: Readonly<State> = {
    loading: true,
    list: [],
    orgs: [],
  };

  async componentDidMount() {
    const [city_coordinates, orgs] = await Promise.all([
      (
        await fetch(
          'https://ideapp.dev/public-meta-data/china-city-coordinate.json',
        )
      ).json() as Promise<Record<string, [number, number]>>,
      call<Organization[]>('organization'),
    ]);

    const list = Object.entries(groupBy(orgs, 'city'))
      .map(([city, list]) => {
        const point = city_coordinates[city! as string];

        if (point)
          return {
            name: `${city} ${list.length}`,
            value: [...point, list.length],
          };
      })
      .filter(Boolean) as State['list'];

    this.setState({ loading: false, list, orgs });
  }

  renderOrganization = ({
    name,
    logos,
    city,
    type,
    tags,
    summary,
    email,
    link,
    codeLink,
    wechatName,
  }: Organization) => {
    const { currentCity } = this.state;

    return (
      (!currentCity || currentCity === city) && (
        <Col key={name as string}>
          <Card className="text-start">
            <Card.Img
              variant="top"
              style={{ height: '30vh', objectFit: 'contain' }}
              src={
                (logos instanceof Array
                  ? logos[0]?.link
                  : logos && logos.split(/\s+/)[0]) || ''
              }
            />
            <Card.Body>
              <Card.Title>
                {name} <Badge bg={text2color(type as string)}>{type}</Badge>
              </Card.Title>
              <Card.Text className="text-end">
                {(tags as string)?.split(',').map(tag => (
                  <Badge key={tag} bg={text2color(tag)} className="me-2">
                    {tag}
                  </Badge>
                ))}
              </Card.Text>
              <Card.Text>{summary?.slice(0, 100)}</Card.Text>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-around">
              {email && (
                <Button
                  title="E-mail"
                  size="sm"
                  variant="warning"
                  href={`mailto:${email}`}
                >
                  <Icon name="mailbox2" />
                </Button>
              )}
              {link && (
                <Button
                  title="WWW"
                  size="sm"
                  target="_blank"
                  href={link as string}
                >
                  <Icon name="globe2" />
                </Button>
              )}
              {codeLink && (
                <Button
                  title="Git"
                  size="sm"
                  variant="dark"
                  target="_blank"
                  href={codeLink as string}
                >
                  <Icon name="github" />
                </Button>
              )}
              {wechatName && (
                <Button
                  title="WeChat"
                  size="sm"
                  variant="success"
                  target="_blank"
                  href={`https://weixin.sogou.com/weixin?type=1&query=${wechatName}`}
                >
                  <Icon name="chat-fill" />
                </Button>
              )}
            </Card.Footer>
          </Card>
        </Col>
      )
    );
  };

  render() {
    const { loading, list, orgs } = this.state;

    return (
      <>
        <PageHead title="开源地图" />

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
            <div style={{ height: '80vh' }}>
              <Amap zoom={4}>
                {list.map(({ name, value }) => (
                  <Marker
                    key={value + ''}
                    position={value}
                    label={{
                      content: name,
                      direction: 'top',
                    }}
                    onClick={() => this.setState({ currentCity: name })}
                  />
                ))}
              </Amap>
            </div>
          )}
          <Row xs={1} sm={2} lg={3} xxl={4} className="g-4 my-4">
            {orgs.map(this.renderOrganization)}
          </Row>
        </Container>
      </>
    );
  }
}
