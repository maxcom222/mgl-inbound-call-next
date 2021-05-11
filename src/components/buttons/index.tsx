/* eslint import/namespace: ['error', { allowComputed: true }] */

import React from 'react';
import * as Icon from 'react-feather';
import {Tooltip} from 'react-tippy';

export const Button: React.FunctionComponent<Props> = ({
  rounded = false,
  outlined = false,
  flat = false,
  raised = false,
  icon = false,
  size = 'default',
  color = icon ? '' : 'indigo',
  className = '',
  children = false,
  onClick = false,
  leftIcon = '',
  rightIcon = '',
  loading = false,
  disabled = loading ? true : false,
  tooltip = '',
  ...rest
}: Props) => {
  const classes: string[] = [];
  const LeftIcon = Icon[leftIcon];
  const RightIcon = Icon[rightIcon];

  let iconSize = 16;
  if(size === 'xl') iconSize = 20;
  if(size === 'lg') iconSize = 20;
  if(size === 'sm') iconSize = 14;
  if(size === 'xs') iconSize = 12;

  if (rounded) classes.push('btn-rounded');
  if (raised) classes.push('btn-raised');
  if (icon) classes.push('btn-icon');
  if (className) classes.push(className);

  const button = (
    <button
      className={`
        btn
        ${!icon ? `btn-${size}` : ''}
        ${!flat && !outlined ? `btn-${color}` : ''}
        ${flat ? `btn-flat btn-flat-${color}` : ''}
        ${outlined ? `btn-outlined btn-outlined-${color}` : ''}
        ${loading ? 'cursor-not-allowed' : ''}
        ${classes.join(' ')}
      `}
      disabled={disabled}
      {...rest}
      onClick={(e) => onClick ? onClick(e) : false}
    >
      <div
        className={`
          flex justify-center items-center
          ${loading ? 'text-transparent' : ''}
        `}
      >
        {leftIcon !== '' &&
          <LeftIcon size={iconSize} strokeWidth={2} className={children? 'mr-1' : ''} />
        }
        {children}
        {rightIcon !== '' &&
          <RightIcon size={iconSize} strokeWidth={1.5} className={children? 'ml-1' : ''} />
        }
      </div>
      {loading &&
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="loader"></div>
        </div>
      }
    </button>
  );

  return(
    <>
      {tooltip !== ''
        ? <Tooltip title={tooltip} position="right" arrow duration={0} hideDuration={0}>{button}</Tooltip>
        : button
      }
    </>
  );
};

type Props = {
  readonly size?: 'sm' | 'default' | 'lg' | 'xs' | 'xl';
  readonly rounded?: boolean;
  readonly outlined?: boolean;
  readonly flat?: boolean;
  readonly icon?: boolean;
  readonly raised?: boolean;
  readonly color?: 'indigo' | 'green' | 'red' | 'gray' | 'orange' | 'yellow' | 'teal' | 'blue' | 'purple' | 'pink' | '';
  readonly children?: any;
  readonly className?: string;
  readonly onClick?: any;
  readonly leftIcon?: string;
  readonly rightIcon?: string;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly tooltip?: string;
};

export const CircularButton: React.FunctionComponent<Props> = ({
  outlined = false,
  flat = false,
  raised = false,
  size = 'default',
  color = 'indigo',
  className = '',
  children,
  ...rest
}: Props) => {
  const classes: string[] = [];
  if (raised) classes.push('btn-raised');
  if (className) classes.push(className);

  return (
    <button
      className={`
        btn
        btn-circle 
        btn-circle-${size} 
        ${!flat && !outlined ? `btn-${color}` : ''}
        ${flat ? `btn-flat btn-flat-${color}` : ''}
        ${outlined ? `btn-outlined btn-outlined-${color}` : ''}
        ${classes.join(
        ' '
      )}`}
      {...rest}
    >
      {children}
    </button>
  );
};