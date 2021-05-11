import React from 'react';

export const Badge: React.FunctionComponent<Props> = ({
  rounded = false,
  outlined = false,
  alt = false,
  size = 'default',
  color = 'indigo',
  children,
}: Props) => {
  const css: string[] = [];
  if (rounded) css.push('rounded');

  if (alt) {
    return (
      <span
        className={`badge badge-${size} badge-alt-${color} ${css.join(' ')}`}
      >
        {children}
      </span>
    );
  }

  if (outlined) {
    return (
      <span
        className={`badge badge-${size} badge-outlined badge-outlined-${color} ${css.join(
          ' '
        )}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span className={`badge badge-${size} badge-${color} ${css.join(' ')}`}>
      {children}
    </span>
  );
};

type Props = {
  readonly size?: 'xs' | 'sm' | 'default' | 'lg';
  readonly rounded?: boolean;
  readonly outlined?: boolean;
  readonly alt?: boolean;
  readonly children: any;
  readonly color: string;
};

export const CircularBadge: React.FunctionComponent<Props> = ({
  size = 'default',
  outlined = false,
  alt = false,
  color = 'indigo',
  children,
}: Props) => {
  if (alt) {
    return (
      <span className={`badge badge-circle badge-${size} badge-alt-${color}`}>
        {children}
      </span>
    );
  }

  if (outlined) {
    return (
      <span
        className={`badge badge-circle badge-${size} badge-outlined badge-outlined-${color}`}
      >
        {children}
      </span>
    );
  }

  return (
    <span className={`badge badge-circle badge-${size} badge-${color}`}>
      {children}
    </span>
  );
};
