import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { getColor, toRGB, isDarkPalette } from 'functions/colors';
import { random } from 'functions/numbers';

const Chart: React.FunctionComponent<any> = ({
  height = 200,
  color1 = 'bg-pink-500',
  color2 = 'bg-blue-500',
  color3 = 'bg-teal-500',
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

  const randomData1 = Array.from(Array(24).keys()).map(() => random(50, 100));

  const randomData2 = Array.from(Array(24).keys()).map(() => random(50, 100));

  const randomData3 = Array.from(Array(24).keys()).map(() => random(50, 100));
  const labels = [
    ...[
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ].map((i) => `${i} 2019`),
    ...[
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ].map((i) => `${i} 2020`),
  ];

  const legend = {
    display: true,
    position: 'bottom',
    labels: {
      fontColor: isDark ? getColor('text-gray-100') : getColor('text-gray-900'),
      boxWidth: 10,
      fontSize: 11,
    },
  };

  const options = {
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    hover: {
      mode: 'nearest',
      intersect: true,
    },
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
          // display: false,
          stacked: true,
          ticks: {
            fontColor: isDark
              ? getColor('text-gray-100')
              : getColor('text-gray-900'),
            min: 0,
            maxTicksLimit: 10,
          },
          gridLines: {
            drawBorder: false,
            display: false,
            color: 'rgba(0, 0, 0, 0)',
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
          ticks: {
            fontColor: isDark
              ? getColor('text-gray-100')
              : getColor('text-gray-900'),
            min: 0,
            maxTicksLimit: 10,
          },
          gridLines: {
            drawBorder: false,
            display: false,
            color: 'rgba(0, 0, 0, 0)',
          },
        },
      ],
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Sales',
        backgroundColor: toRGB(getColor(color1), 1),
        borderColor: toRGB(getColor(color1), 1),
        data: randomData1,
      },
      {
        label: 'Conversions',
        backgroundColor: toRGB(getColor(color2), 1),
        borderColor: toRGB(getColor(color2), 1),
        data: randomData2,
      },
      {
        label: 'Clicks',
        backgroundColor: toRGB(getColor(color3), 1),
        borderColor: toRGB(getColor(color3), 1),
        data: randomData3,
      },
    ],
  };

  return (
    <div style={{ height }}>
      <Bar
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
