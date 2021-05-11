import React from 'react';

import { useSelector, shallowEqual } from 'react-redux';
import { Pie } from 'react-chartjs-2';
import { getColor, isDarkPalette } from 'functions/colors';
import { random } from 'functions/numbers';

const Chart: React.FunctionComponent<any> = ({ height }: any) => {
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

  const colors = [
    getColor('bg-red-500'),
    getColor('bg-blue-500'),
    getColor('bg-yellow-500'),
  ];
  const hoverColors = [
    getColor('bg-red-600'),
    getColor('bg-blue-600'),
    getColor('bg-yellow-600'),
  ];

  const data = {
    labels: ['Orders', 'Income', 'Users'],
    datasets: [
      {
        data: [random(50, 100), random(50, 100), random(50, 100)],
        backgroundColor: colors,
        borderColor: colors,
        hoverBorderColor: hoverColors,
        hoverBackgroundColor: hoverColors,
      },
    ],
  };

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
  };

  return (
    <div style={{ height }}>
      <Pie
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
