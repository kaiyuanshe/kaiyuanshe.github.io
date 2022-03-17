import { PureComponent } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  ScatterChart,
  ScatterSeriesOption,
  EffectScatterChart,
  EffectScatterSeriesOption,
} from 'echarts/charts';
import { TooltipComponent, TitleComponentOption } from 'echarts/components';
import {
  install as AMapComponent,
  AMapComponentOption,
} from 'echarts-extension-amap/export';
import '@amap/amap-jsapi-types';

type ECOption = echarts.ComposeOption<
  ScatterSeriesOption | EffectScatterSeriesOption | TitleComponentOption
> &
  AMapComponentOption<AMap.MapOptions>;

echarts.use([
  CanvasRenderer,
  TooltipComponent,
  AMapComponent,
  ScatterChart,
  EffectScatterChart,
]);

export interface MapPoint {
  name: string;
  value: number[];
}

export interface AMapChartProps {
  list: MapPoint[];
  onSelect?: (point: MapPoint) => any;
}

interface State {
  rendererLoaded: boolean;
}

const NEXT_PUBLIC_AMAP_KEY = process.env.NEXT_PUBLIC_AMAP_KEY!;

export default class AMapChart extends PureComponent<AMapChartProps, State> {
  state: Readonly<State> = {
    rendererLoaded: false,
  };

  async componentDidMount() {
    const { load } = await import('@amap/amap-jsapi-loader');

    await load({
      version: '1.4.15',
      key: NEXT_PUBLIC_AMAP_KEY,
      plugins: ['AMap.Scale', 'AMap.ToolBar'],
    });
    this.setState({ rendererLoaded: true });
  }

  option: ECOption = {
    amap: {
      viewMode: '3D',
      center: [108.39, 39.9],
      zoom: 4,
      // @ts-ignore
      resizeEnable: true,
      mapStyle: 'amap://styles/dark',
      renderOnMoving: true,
      echartsLayerZIndex: 2019,
      echartsLayerInteractive: true,
      largeMode: false,
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'scatter',
        coordinateSystem: 'amap',
        data: [],
        encode: { value: 2 },
        label: {
          formatter: '{b}',
          position: 'right',
          show: false,
        },
        itemStyle: { color: '#00c1de' },
        emphasis: {
          label: { show: true },
        },
      },
    ],
  };

  init = (ref: ReactEChartsCore | null) => {
    if (!ref) return;

    const amapComponent = ref
      .getEchartsInstance()
      // @ts-ignore
      .getModel()
      .getComponent('amap');

    amapComponent.setEChartsLayerInteractive(false);

    const amap = amapComponent.getAMap() as AMap.Map;

    // @ts-ignore
    amap.addControl(new AMap.Scale());
    // @ts-ignore
    amap.addControl(new AMap.ToolBar());

    const { list, onSelect } = this.props;

    if (!(onSelect instanceof Function)) return;

    for (const point of list) {
      const {
        name,
        value: [longitude, latitude],
      } = point;

      amap.add(
        new AMap.Marker({
          title: name,
          position: [longitude, latitude],
        }).on('click', () => onSelect(point)),
      );
    }
  };

  render() {
    const { rendererLoaded } = this.state;
    // @ts-ignore
    this.option.series[0]!.data = this.props.list;

    return (
      rendererLoaded && (
        <ReactEChartsCore
          style={{ height: '80vh' }}
          echarts={echarts}
          ref={this.init}
          option={this.option}
        />
      )
    );
  }
}
