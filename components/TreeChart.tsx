import { FC } from 'react';
import { SVGCharts, Tooltip, TreeSeriesProps, TreeSeries } from 'echarts-jsx';

const TreeChart: FC<TreeSeriesProps> = series => (
  <SVGCharts>
    <Tooltip trigger="item" triggerOn="mousemove" />

    <TreeSeries
      label={{
        position: 'left',
        verticalAlign: 'middle',
        fontSize: 16,
      }}
      {...series}
    />
  </SVGCharts>
);

export default TreeChart;
