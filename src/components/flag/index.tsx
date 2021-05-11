import React from 'react';

type Props = {
  readonly size: string;
  readonly code: string;
};
const Flag: React.FunctionComponent<Props> = ({ size = 'lg', code }: Props) => (
  <span className={`text-${size} flag-icon flag-icon-${code}`}></span>
);

export default Flag;
