import React from 'react';

const Table1: React.FunctionComponent<any> = () => {
  const ticker = {
    name: 'Apple Inc.',
    ticker: 'AAPL',
    price: 282.8,
    currency: 'USD',
    variation: -3.89,
    variationPercent: -1.36,
    table: [
      {
        key: 'Price',
        value: 282.8,
      },
      {
        key: 'Open',
        value: 284.69,
      },
      {
        key: 'Close',
        value: 286.69,
      },
      {
        key: 'Dividend yield',
        value: '1.09%',
      },
      {
        key: 'P/E ratio',
        value: 22.34,
      },
      {
        key: 'Market cap',
        value: '1.24T',
      },
      {
        key: 'High',
        value: 286.94,
      },
      {
        key: 'Low',
        value: 276.86,
      },
      {
        key: '52 week high',
        value: 327.85,
      },
      {
        key: '52 week low',
        value: 170.27,
      },
    ],
  };

  return (
    <>
      <div className="flex flex-row w-full items-center justify-start mt-4 mb-8 lg:hidden">
        <div className="flex flex-col w-1/2">
          <div className="text-base font-bold">
            {ticker.name} ({ticker.ticker})
          </div>

          <div className="text-4xl">{ticker.price}</div>

          <div className="text-sm text-red-500">
            <span className="font-normal">{ticker.variation}</span>{' '}
            <span className="font-bold">({ticker.variationPercent}%)</span>
          </div>
        </div>

        <div className="flex flex-row flex-wrap w-1/2">
          {ticker.table.slice(0, 4).map((item: any, i: any) => (
            <div className="w-full" key={i}>
              <span className="text-default text-sm">{item.key}:</span>{' '}
              <span className="text-default font-bold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-row lg:w-full lg:items-center lg:justify-between">
        <div className="flex flex-col mb-4 lg:w-1/2">
          <div className="text-base font-bold">
            {ticker.name} ({ticker.ticker})
          </div>

          <div className="text-4xl">{ticker.price}</div>

          <div className="text-sm text-red-500">
            <span className="font-normal">{ticker.variation}</span>{' '}
            <span className="font-bold">({ticker.variationPercent}%)</span>
          </div>
        </div>

        <div className="flex flex-col mb-4 lg:w-1/2">
          <div className="flex flex-wrap">
            {ticker.table.map((item: any, i: any) => (
              <div className="w-1/2" key={i}>
                <span className="text-secondary text-sm">{item.key}:</span>{' '}
                <span className="text-default font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Table1;
