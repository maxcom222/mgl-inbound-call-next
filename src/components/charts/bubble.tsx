import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Bubble } from 'react-chartjs-2';
import { getColor, toRGB, isDarkPalette } from 'functions/colors';

const Chart: React.FunctionComponent<any> = ({
  height = 200,
  bgColor = 'bg-red-400',
  borderColor = 'bg-red-500',
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
            callback(value) {
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
        label: 'This month',
        backgroundColor: toRGB(getColor(bgColor), 0.3),
        borderColor: toRGB(getColor(borderColor), 1),
        data: [{ x: 10, y: 20, r: 5 }],
      },
    ],
  };

  return (
    <div style={{ height }}>
      <Bubble
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
