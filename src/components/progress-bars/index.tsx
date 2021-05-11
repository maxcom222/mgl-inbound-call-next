/* eslint-disable max-len */
import React from 'react';

export const ProgressBar: React.FunctionComponent<ProgressBarProps> = ({
  width,
  color,
}: ProgressBarProps) => (
  <div className={`progress-bar progress-bar-${color}`}>
    <div style={{ width: `${width}%` }}></div>
  </div>
);

type ProgressBarProps = {
  readonly width: number;
  readonly color?: string;
};

export const ProgressBarWithText: React.FunctionComponent<ProgressBarProps> = ({
  width,
  color,
}: ProgressBarProps) => (
  <div className={`progress-bar progress-bar-with-text progress-bar-${color}`}>
    <div style={{ width: `${width}%` }}>{width}%</div>
  </div>
);

export const ProgressBarMultiple: React.FunctionComponent<ProgressBarMultipleProps> = ({
  items,
}: ProgressBarMultipleProps) => (
  <div className="flex flex-row">
    {items.map((item, i) => (
      <div style={{ width: `${item.width}%` }} key={i}>
        <div>{item.width}%</div>
      </div>
    ))}
  </div>
);

type ProgressBarMultipleProps = {
  readonly items: readonly ProgressBarProps[];
};
