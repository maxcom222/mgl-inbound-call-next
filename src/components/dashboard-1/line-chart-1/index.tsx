import React, { useState } from 'react';

import { useSelector, shallowEqual } from 'react-redux';
import { Line } from 'react-chartjs-2';
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
          position: 'left',
          id: 'y-axis-0',
          ticks: {
            fontColor: isDark
              ? getColor('text-gray-100')
              : getColor('text-gray-900'),
            min: 0,
            max: 100,
            maxTicksLimit: 10,
          },
          gridLines: {
            drawBorder: false,
            display: false,
            color: 'rgba(0, 0, 0, 0)',
          },
        },
        {
          position: 'right',
          id: 'y-axis-1',
          ticks: {
            fontColor: isDark
              ? getColor('text-gray-100')
              : getColor('text-gray-900'),
            min: 200,
            max: 900,
            maxTicksLimit: 10,
            callback: (value) => `$${value}`,
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

  const initialRandomData1 = Array.from(Array(12).keys()).map(() =>
    random(50, 100)
  );

  const initialRandomData2 = Array.from(Array(12).keys()).map(() =>
    random(300, 800)
  );
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
    ].map((i) => `${i} 2020`),
  ];
  const [option, setOption] = useState(2);
  const [data1, setData1] = useState(initialRandomData1);
  const [data2, setData2] = useState(initialRandomData2);
  // const [labels, setLabels] = useState(defaultLabels);

  const data = {
    labels: defaultLabels,
    datasets: [
      {
        label: 'Sales',
        backgroundColor: 'rgba(255,255,255,0)',
        borderColor: toRGB(getColor(color1), 1),
        data: data1,
        yAxisID: 'y-axis-0',
      },
      {
        label: 'Conversions',
        backgroundColor: 'rgba(255,255,255,0)',
        borderColor: toRGB(getColor(color2), 1),
        data: data2,
        yAxisID: 'y-axis-1',
      },
    ],
  };

  const setThisYear = (): void => {
    const randomData1 = Array.from(Array(12).keys()).map(() => random(50, 100));

    const randomData2 = Array.from(Array(12).keys()).map(() =>
      random(300, 1000)
    );
    setData1(randomData1);
    setData2(randomData2);
    setOption(0);
  };
  const setLastYear = (): void => {
    const randomData1 = Array.from(Array(12).keys()).map(() => random(50, 100));

    const randomData2 = Array.from(Array(12).keys()).map(() =>
      random(300, 1000)
    );
    setData1(randomData1);
    setData2(randomData2);
    setOption(1);
  };
  const setAllTime = (): void => {
    const randomData1 = Array.from(Array(12).keys()).map(() => random(50, 100));

    const randomData2 = Array.from(Array(12).keys()).map(() =>
      random(300, 1000)
    );
    setData1(randomData1);
    setData2(randomData2);
    setOption(2);
  };

  const active = 'text-blue-500';

  return (
    <div className="flex">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <WidgetTitle title={title} description={subtitle} />

          <div className="flex justify-center lg:flex lg:justify-end lg:pr-4">
            <button
              onClick={setThisYear}
              className={`px-2 btn btn-sm btn-flat ${
                option === 0 ? active : ''
              }`}
            >
              1W
            </button>

            <button
              onClick={setLastYear}
              className={`px-2 btn btn-sm btn-flat ${
                option === 1 ? active : ''
              }`}
            >
              1M
            </button>

            <button
              onClick={setAllTime}
              className={`px-2 btn btn-sm btn-flat ${
                option === 2 ? active : ''
              }`}
            >
              3M
            </button>
          </div>
        </div>

        <div style={{ height }}>
          <Line
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
