import React from 'react';
import tickers from 'json/tickers.json';

const Table2: React.FunctionComponent<any> = () => (
  <table className="table">
    <tbody>
      {tickers.map((ticker: any, i: any) => (
        <tr key={i}>
          <td>
            <div className="flex items-center">
              <div>
                <div className="text-sm font-medium text-default">
                  {ticker.symbol}
                </div>

                <div className="text-sm text-secondary">{ticker.name}</div>
              </div>
            </div>
          </td>

          <td className={`text-${ticker.color}-500`}>
            <div className="text-sm">{ticker.change}</div>

            <div className="text-sm">{ticker.change_pct}</div>
          </td>

          <td>{ticker.last_price}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Table2;
