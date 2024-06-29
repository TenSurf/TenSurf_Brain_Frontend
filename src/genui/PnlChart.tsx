import { useLayoutEffect } from 'react';
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';

function PnlChart(props: { data: any; id: number }) {
  useLayoutEffect(() => {
    let root = am5.Root.new(`pnlchart-${props.id}`);

    root.setThemes([am5themes_Animated.new(root)]);

    let chart: am5xy.XYChart = root.container.children.push(
      am5xy.XYChart.new(root, {
        focusable: true,
        panX: true,
        panY: true,
        wheelX: 'panX',
        wheelY: 'zoomX',
        pinchZoomX: true,
        paddingLeft: 0
      })
    );

    var easing = am5.ease.linear;

    // Create Y-axis
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        maxDeviation: 1,
        renderer: am5xy.AxisRendererY.new(root, { pan: 'zoom' })
      })
    );

    // Create X-Axis
    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        // maxDeviation: 0.5,
        baseInterval: {
          timeUnit: 'minute',
          count: 1
        },
        renderer: am5xy.AxisRendererX.new(root, {
          // minGridDistance: 50,
          pan: 'zoom'
          // minorGridEnabled: true
        }),
        tooltip: am5.Tooltip.new(root, {})
      })
    );
    xAxis.data.setAll(props.data);

    let series1 = chart.series.push(
      am5xy.SmoothedXLineSeries.new(root, {
        name: 'Series',
        minBulletDistance: 10,
        // connect: false,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: 'cum_pnl',
        valueXField: 'date',
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: 'horizontal',
          labelText: '{valueY}'
        })
      })
    );

    series1.fills.template.setAll({ fillOpacity: 0.2, visible: true });

    var rangeDataItem = yAxis.makeDataItem({
      value: 0,
      endValue: 10000
    });

    var above_color = am5.color('#26a69a');

    var range = series1.createAxisRange(rangeDataItem);

    range.strokes?.template.setAll({
      stroke: above_color
    });

    range.fills?.template.setAll({
      fill: above_color,
      fillOpacity: 0.2,
      visible: true
    });

    var rangeDataItem = yAxis.makeDataItem({
      value: -10000,
      endValue: 0
    });

    var below_color = am5.color('#ef5350');
    var range = series1.createAxisRange(rangeDataItem);

    range.strokes?.template.setAll({
      stroke: below_color,
      strokeWidth: 3
    });

    range.fills?.template.setAll({
      fill: below_color,
      fillOpacity: 0.2,
      visible: true
    });

    series1.data.processor = am5.DataProcessor.new(root, {
      dateFormat: 'yyyy',
      dateFields: ['year']
    });

    series1.data.setAll(props.data);

    chart.set('cursor', am5xy.XYCursor.new(root, {}));

    series1.bullets.push(function () {
      var circle = am5.Circle.new(root, {
        radius: 4,
        fill: series1.get('fill'),
        stroke: root.interfaceColors.get('background'),
        strokeWidth: 2
      });

      circle.adapters.add('fill', function (fill, target) {
        var dataItem: any = circle.dataItem;
        if (dataItem.get('valueY') >= 0) {
          return above_color;
        } else {
          return below_color;
        }
      });

      return am5.Bullet.new(root, {
        sprite: circle
      });
    });

    var cursor = chart.set(
      'cursor',
      am5xy.XYCursor.new(root, {
        xAxis: xAxis
      })
    );
    cursor.lineY.set('visible', false);

    return () => {
      root.dispose();
    };
  }, []);

  return <div id={`pnlchart-${props.id}`} style={{ height: '50vh', maxHeight: '500px' }}></div>;
}
export default PnlChart;
