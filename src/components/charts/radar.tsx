import React from 'react';

import { useSelector, shallowEqual } from 'react-redux';
import { Radar } from 'react-chartjs-2';
import { getColor, toRGB, isDarkPalette } from 'functions/colors';
import { random } from 'functions/numbers';

const Chart: React.FunctionComponent<any> = ({
  height = 300,
  bgColor1 = 'bg-red-100',
  borderColor1 = 'bg-red-500',
  bgColor2 = 'bg-blue-100',
  borderColor2 = 'bg-blue-500',
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

  const randomData1 = Array.from(Array(7).keys()).map(() => random(50, 100));

  const randomData2 = Array.from(Array(7).keys()).map(() => random(50, 100));

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
            fontColor: isDark
              ? getColor('text-gray-100')
              : getColor('text-gray-900'),
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
          ticks: {
            fontColor: isDark
              ? getColor('text-gray-100')
              : getColor('text-gray-900'),
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
    labels: [
      'Sleeping',
      'Drinking',
      'Eating',
      'Footbal',
      'Rugby',
      'Cycling',
      'Fitness',
    ],
    datasets: [
      {
        label: 'Sports',
        backgroundColor: toRGB(getColor(bgColor1), 0.2),
        borderColor: getColor(borderColor1),
        pointBackgroundColor: getColor(bgColor1),
        pointBorderColor: getColor(borderColor1),
        pointHoverBackgroundColor: getColor(bgColor1),
        pointHoverBorderColor: getColor(borderColor1),
        data: randomData1,
      },
      {
        label: 'Activities',
        backgroundColor: toRGB(getColor(bgColor2), 0.2),
        borderColor: getColor(borderColor2),
        pointBackgroundColor: getColor(bgColor2),
        pointBorderColor: getColor(borderColor2),
        pointHoverBackgroundColor: getColor(bgColor2),
        pointHoverBorderColor: getColor(borderColor2),
        data: randomData2,
      },
    ],
  };

  return (
    <div style={{ height }}>
      <Radar
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
