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

export interface AMapChartProps {
  list: { name: string; value: number[] }[];
}

export default class AMapChart extends PureComponent<AMapChartProps> {
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

  init(ref: ReactEChartsCore | null) {
    if (!ref) return;

    const amapComponent = ref
      .getEchartsInstance()
      // @ts-ignore
      .getModel()
      .getComponent('amap');

    const amap = amapComponent.getAMap();

    // @ts-ignore
    amap.addControl(new AMap.Scale());
    // @ts-ignore
    amap.addControl(new AMap.ToolBar());
  }

  render() {
    // @ts-ignore
    this.option.series[0]!.data = this.props.list;

    return (
      <ReactEChartsCore
        style={{ height: '80vh' }}
        echarts={echarts}
        ref={this.init}
        option={this.option}
      />
    );
  }
}
