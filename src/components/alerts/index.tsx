import React, { useState } from 'react';

const Warning: React.FunctionComponent<any> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={'alert-icon stroke-current inline-block h-5 w-5'}
  >
    <circle cx="12" cy="12" r="10"></circle>

    <line x1="12" y1="8" x2="12" y2="12"></line>

    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const Info: React.FunctionComponent<any> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={'alert-icon stroke-current inline-block h-5 w-5'}
  >
    <circle cx="12" cy="12" r="10"></circle>

    <line x1="12" y1="16" x2="12" y2="12"></line>

    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

type IconProps = {
  readonly type?: 'warning' | 'info';
};

const Icon: React.FunctionComponent<IconProps> = ({ type }: IconProps) => {
  if (type === 'warning') return <Warning />;

  if (type === 'info') return <Info />;

  return null;
};

type AlertProps = {
  readonly color?: string;
  readonly outlined?: boolean;
  readonly raised?: boolean;
  readonly flat?: boolean;
  readonly rounded?: boolean;
  readonly type?: 'warning' | 'info';
  readonly children?: any;
  readonly size?: string;
};

export const Alert: React.FunctionComponent<AlertProps> = ({
  color = 'blue',
  outlined = false,
  raised = false,
  flat = false,
  rounded = false,
  type,
  size = 'default',
  children,
}: AlertProps) => {
  const [hidden, setHidden] = useState(false);
  const css: string[] = [];
  if (outlined) css.push(`alert-outlined alert-outlined-${color}`);
  if (flat) css.push(`alert-flat alert-flat-${color}`);
  if (raised) css.push('alert-raised');
  if (rounded) css.push('alert-rounded');
  if (hidden) css.push('alert-hidden');
  css.push(`alert-${size}`);

  return (
    <div className={`alert alert-${color} ${css.join(' ')}`}>
      <div className="alert-icon-wrapper">
        <Icon type={type} />
      </div>

      <div>{children}</div>

      <button
        className="alert-close flex justify-center"
        onClick={() => setHidden(!hidden)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={'stroke-current inline-block h-5 w-5'}
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>

          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};
