import React from 'react';

import { useSelector, shallowEqual } from 'react-redux';
import { Scatter } from 'react-chartjs-2';
import { getColor, toRGB, isDarkPalette } from 'functions/colors';
import { random } from 'functions/numbers';

const Chart: React.FunctionComponent<any> = ({
  height = 200,
  bgColor = 'bg-red-400',
  // borderColor = 'bg-red-500',
}) => {
  const { palettes, collapsed, layout } = useSelector(
    (state: any) => ({
      palettes: state.global.palettes,
      collapsed: state.global.collapsed,
      layout: state.global.layout,
    }),
    shallowEqual
  );
  const { background }: any = { ...palettes };
  const isDark = isDarkPalette(background);
  const key = `${layout}-${collapsed}-${background}`;

  const randomData = Array.from(Array(12).keys()).map(() => ({
    x: random(10, 100),
    y: random(10, 100),
  }));

  const legend = {
    display: true,
    labels: {
      fontColor: isDark ? getColor('text-gray-100') : getColor('text-gray-900'),
      boxWidth: 10,
      fontSize: 11,
    },
  };

  const options = {
    animation: {
      duration: 0,
    },
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            min: 0,
            fontColor: isDark
              ? getColor('text-gray-100')
              : getColor('text-gray-900'),
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: isDark
              ? getColor('text-gray-100')
              : getColor('text-gray-900'),
            min: 0,
            callback(value: any) {
              return value;
            },
          },
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
          },
        },
      ],
    },
  };

  const data = {
    labels: ['Performance'],
    datasets: [
      {
        label: 'Sales',
        backgroundColor: toRGB(getColor(bgColor), 0.3),
        borderColor: toRGB(getColor(bgColor), 1),
        borderWidth: 1,
        pointBorderColor: toRGB(getColor(bgColor), 1),
        pointRadius: 5,
        pointHitRadius: 10,
        pointBorderWidth: 1,
        data: randomData,
      },
    ],
  };

  return (
    <div style={{ height }}>
      <Scatter
        key={key}
        data={data}
        height={height}
        options={options}
        legend={legend}
      />
    </div>
  );
};
export default Chart;
