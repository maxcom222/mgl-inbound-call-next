import React from 'react';

export type IconButtonProps<T = any> = React.ButtonHTMLAttributes<T> & {
  readonly icon: string;
};

export const IconButton: React.FunctionComponent<IconButtonProps> = ({
  icon,
  ...props
}) => (
  <button {...props}>
    <i className={icon}></i>
  </button>
);

type InputProps<T> = React.InputHTMLAttributes<T>;
type InputComponent<T = any> = React.FunctionComponent<InputProps<T>>;

export const Button: InputComponent = (props) => (
  <input className="primary" {...props} />
);
