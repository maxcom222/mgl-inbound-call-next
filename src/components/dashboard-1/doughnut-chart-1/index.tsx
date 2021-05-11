import React, { useState } from 'react';

import { useSelector, shallowEqual } from 'react-redux';

import { Doughnut } from 'react-chartjs-2';
import { getColor } from 'functions/colors';
import { random } from 'functions/numbers';

import DoughnutChartTitle from 'components/widget-title';

import Button from './button';

const DoughnutChart: React.FunctionComponent<any> = ({
  title,
  subtitle,
  height = 260,
}: any) => {
  const { direction, palettes, collapsed, layout } = useSelector(
    (state: any) => ({
      direction: state.global.direction,
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

  const legend = {
    display: true,
    labels: {
      fontColor: isDark ? getColor('text-gray-100') : getColor('text-gray-900'),
      boxWidth: 10,
      fontSize: 11,
    },
  };

  const options = {
    cutoutPercentage: 60,
    animation: {
      duration: 1000,
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

  const defaultData = {
    labels: ['Online', 'Offline', 'In store'],
    datasets: [
      {
        data: [random(20, 100), random(20, 100), random(20, 100)],
        backgroundColor: colors,
        borderColor: colors,
        hoverBackgroundColor: hoverColors,
        hoverBorderColor: hoverColors,
      },
    ],
  };

  // const [option, setOption] = useState(2);
  const [data, setData] = useState<Record<string, any>>(defaultData);

  const setRandomData = (): void => {
    const randomData = {
      labels: ['Orders', 'Income', 'Users'],
      datasets: [
        {
          data: [random(20, 100), random(20, 100), random(20, 100)],
          backgroundColor: colors,
          hoverBackgroundColor: colors,
        },
      ],
    };
    setData(randomData);
  };

  const [hidden, setHidden] = useState(true);

  return (
    <div className="flex w-full">
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <DoughnutChartTitle title={title} description={subtitle} />

          <div className="flex h-8 w-8 ltr:mr-4 rtl:ml-4">
            <div className="relative">
              <button
                className={'flex items-center justify-center rounded h-8 w-8'}
                onClick={() => setHidden(!hidden)}
              >
                <i className="icon-settings text-base text-default font-bold"></i>
              </button>

              <div
                className={`dropdown ${
                  direction === 'ltr' ? 'dropdown-right' : 'dropdown-left'
                } w-48 ${hidden ? '' : 'open'}`}
              >
                <div className="w-48 dropdown-content flex flex-col">
                  {['This week', 'This month', 'This year', 'Today'].map(
                    (item, i) => (
                      <Button key={i} text={item} onClick={setRandomData} />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ height }}>
          <Doughnut
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

export default DoughnutChart;
