import { groupBy } from 'lodash';
import { PureComponent } from 'react';
import Script from 'next/script';
import { Button, Container, Spinner } from 'react-bootstrap';

import AMapChart, { AMapChartProps } from '../../components/AMapChart';
import { city_coordinates } from '../api/city';

interface Organization {
  name: string;
  location?: {
    country: string;
    province?: string;
    city?: string;
    district?: string;
  };
}

interface State extends AMapChartProps {
  loading: boolean;
}

export default class OpenSourceMap extends PureComponent<{}, State> {
  state: Readonly<State> = {
    loading: true,
    list: [],
  };

  async componentDidMount() {
    const response = await fetch('https://data.kaiyuanshe.cn/organizations');
    const data = (await response.json()) as Organization[];

    const map = groupBy(
      data.filter(({ location }) => location?.city),
      ({ location }) => location!.city,
    );
    const list = Object.entries(map)
      .map(
        ([city, [{ name }]]) =>
          city_coordinates[city] && {
            name,
            value: [...city_coordinates[city], 1],
          },
      )
      .filter(Boolean);

    this.setState({ loading: false, list });
  }

  render() {
    const { loading, list } = this.state;

    return (
      <>
        <Script src="https://webapi.amap.com/maps?v=1.4.15&plugin=AMap.Scale,AMap.ToolBar&key=8325164e247e15eea68b59e89200988b" />

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
            <AMapChart list={list} />
          )}
        </Container>
      </>
    );
  }
}
