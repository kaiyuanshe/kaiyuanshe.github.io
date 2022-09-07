import { groupBy } from 'lodash';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Loading } from 'idea-react';
import { Amap, Marker } from '@amap/amap-react';

import PageHead from '../../components/PageHead';
import { OrganizationCard } from '../../components/OrganizationCard';
import organizationStore, { Organization } from '../../models/Organization';

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

@observer
export class OpenSourceMap extends PureComponent<{}, State> {
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
      organizationStore.getList(),
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

  render() {
    const { loading, currentCity, list } = this.state;
    const { currentPage } = organizationStore;

    return (
      <>
        {loading ? (
          <Loading />
        ) : (
          <div style={{ height: '65vh' }}>
            {/* <Amap zoom={4}>
              {list.map(({ name, value }) => (
                <Marker
                  key={value + ''}
                  position={value}
                  label={{
                    content: name,
                    direction: 'top',
                  }}
                  onClick={() =>
                    this.setState({ currentCity: name.split(/\s+/)[0] })
                  }
                />
              ))}
            </Amap> */}
          </div>
        )}
        <Row xs={1} sm={2} lg={3} xxl={4} className="g-4 my-2">
          {currentPage.map(
            ({ id, ...org }) =>
              (!currentCity || currentCity === org.city) && (
                <Col key={org.name as string}>
                  <OrganizationCard className="h-100" {...org} />
                </Col>
              ),
          )}
        </Row>
      </>
    );
  }
}

export default function OrganizationPage() {
  return (
    <>
      <PageHead title="开源地图" />

      <Container>
        <header className="d-flex justify-content-between align-items-center">
          <h1 className="my-4">中国开源地图</h1>
          <div>
            <Button
              size="sm"
              target="_blank"
              href="https://kaiyuanshe.feishu.cn/share/base/shrcnPgQoUZzkpWB2W4dp2QQvbd"
            >
              + 加入开源地图
            </Button>
          </div>
        </header>

        <OpenSourceMap />
      </Container>
    </>
  );
}
