import React, { useState } from 'react';

import { useSelector, shallowEqual } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import { getColor, toRGB } from 'functions/colors';
import { random } from 'functions/numbers';

const Widget: React.FunctionComponent<any> = ({
  title,
  subtitle,
  height = 200,
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
            maxTicksLimit: 5,
            callback: (value) => `$${value}`,
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
            min: 40,
            max: 80,
            maxTicksLimit: 5,
            callback: (value) => `${value} MM`,
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

  let n = 0;
  const randomData1: any = [];

  Array.from(Array(60).keys()).forEach((i) => {
    if (i < 60) n = random(200, 250);
    if (i < 48) n = random(150, 200);
    if (i < 36) n = random(100, 150);
    if (i < 24) n = random(75, 150);
    if (i < 12) n = random(10, 75);
    randomData1[i] = n;
  });

  const randomData2 = Array.from(Array(60).keys()).map(() => random(60, 70));
  const months = [
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
  ];
  const defaultLabels = [
    ...months.map((i) => `${i} 2016`),
    ...months.map((i) => `${i} 2017`),
    ...months.map((i) => `${i} 2018`),
    ...months.map((i) => `${i} 2019`),
    ...months.map((i) => `${i} 2020`),
  ];
  const [option, setOption] = useState(4);
  const [data1, setData1] = useState(randomData1);
  const [data2, setData2] = useState(randomData2);
  const [labels, setLabels] = useState(defaultLabels);

  const color1 = 'bg-blue-500';
  let color2 = 'bg-gray-200';
  if (background === 'bg-gray-100') color2 = 'bg-gray-300';
  if (background === 'bg-gray-800') color2 = 'bg-gray-700';
  if (background === 'bg-gray-900') color2 = 'bg-gray-800';
  if (background === 'bg-indigo-700') color2 = 'bg-indigo-600';
  if (background === 'bg-indigo-800') color2 = 'bg-indigo-700';

  const data = {
    labels,
    datasets: [
      {
        label: 'Price',
        type: 'line',
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: toRGB(getColor(color1), 1),
        data: data1,
        yAxisID: 'y-axis-0',
      },
      {
        label: 'Volume',
        backgroundColor: toRGB(getColor(color2), 1),
        borderColor: toRGB(getColor(color2), 1),
        data: data2,
        yAxisID: 'y-axis-1',
      },
    ],
  };

  const setPeriod = (p: any): void => {
    setData1(randomData1);
    setData2(randomData2);
    setLabels(defaultLabels);
    setOption(p);
  };

  const active = 'text-blue-500';

  return (
    <div className="flex">
      <div className="w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex flex-col mb-4 lg:mb-0">
            <div className="text-base font-base font-bold font-poppins">
              {title}
            </div>

            <div className="text-sm">{subtitle}</div>
          </div>

          <div className="flex justify-center lg:flex lg:justify-end">
            <button
              onClick={() => setPeriod(0)}
              className={`px-2 btn btn-sm btn-flat ${
                option === 0 ? active : ''
              }`}
            >
              3M
            </button>

            <button
              onClick={() => setPeriod(1)}
              className={`px-2 btn btn-sm btn-flat ${
                option === 1 ? active : ''
              }`}
            >
              6M
            </button>

            <button
              onClick={() => setPeriod(2)}
              className={`px-2 btn btn-sm btn-flat ${
                option === 2 ? active : ''
              }`}
            >
              1Y
            </button>

            <button
              onClick={() => setPeriod(3)}
              className={`px-2 btn btn-sm btn-flat ${
                option === 3 ? active : ''
              }`}
            >
              3Y
            </button>

            <button
              onClick={() => setPeriod(4)}
              className={`px-2 btn btn-sm btn-flat ${
                option === 4 ? active : ''
              }`}
            >
              5Y
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
