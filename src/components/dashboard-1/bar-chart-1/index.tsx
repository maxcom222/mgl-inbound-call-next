import React, { useState } from 'react';

import { useSelector, shallowEqual } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { getColor, toRGB } from 'functions/colors';
import { random } from 'functions/numbers';

import WidgetTitle from 'components/widget-title';

const Widget: React.FunctionComponent<any> = ({
  title,
  subtitle,
  height = 200,
  color1 = 'bg-teal-500',
  color2 = 'bg-blue-500',
}: any) => {
  const { palettes, collapsed, layout } = useSelector(
    (state: any) => ({
      palettes: state.global.palettes,
      collapsed: state.global.collapsed,
      layout: state.global.layout,
    }),
    shallowEqual
  );
  const { background }: any = { ...palettes };

  const isDark = [
    'bg-gray-800',
    'bg-gray-900',
    'bg-indigo-700',
    'bg-indigo-800',
  ].includes(background);
  const key = `${layout}-${collapsed}-${background}`;

  const legend = {
    display: false,
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
      duration: 1000,
    },
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    scales: {
      xAxes: [
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

  const randomData1 = Array.from(Array(24).keys()).map(() => random(50, 100));

  const randomData2 = Array.from(Array(24).keys()).map(() => random(50, 100));
  const defaultLabels = [
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
  const [option, setOption] = useState(2);
  const [data1, setData1] = useState(randomData1);
  const [data2, setData2] = useState(randomData2);
  // const [labels, setLabels] = useState(defaultLabels);

  const data = {
    labels: defaultLabels,
    datasets: [
      {
        label: 'Sales',
        backgroundColor: toRGB(getColor(color1), 1),
        borderColor: toRGB(getColor(color1), 1),
        data: data1,
      },
      {
        label: 'Conversions',
        backgroundColor: toRGB(getColor(color2), 1),
        borderColor: toRGB(getColor(color2), 1),
        data: data2,
      },
    ],
  };

  const setPeriod = (period: any): void => {
    setData1(Array.from(Array(24).keys()).map(() => random(50, 100)));

    setData2(Array.from(Array(24).keys()).map(() => random(50, 100)));
    setOption(period);
  };

  const active = 'btn-flat-blue';

  return (
    <div className="flex">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <WidgetTitle title={title} description={subtitle} />

          <div className="flex justify-center lg:flex lg:justify-end children-x-2">
            <button
              onClick={() => setPeriod(0)}
              className={`btn btn-sm btn-flat ${option === 0 ? active : ''}`}
            >
              1W
            </button>

            <button
              onClick={() => setPeriod(1)}
              className={`btn btn-sm btn-flat ${option === 1 ? active : ''}`}
            >
              1M
            </button>

            <button
              onClick={() => setPeriod(2)}
              className={`btn btn-sm btn-flat ${option === 2 ? active : ''}`}
            >
              3M
            </button>
          </div>
        </div>

        <div style={{ height }}>
          <Bar
            key={key}
            data={data}
            height={height}
            options={options}
            legend={legend}
          />
        </div>
      </div>
    </div>
  );
};

export default Widget;
