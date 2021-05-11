import React, { forwardRef } from 'react';
import { FormControlProps } from './util';
import { ErrorMessage } from './Message';

type InputProps = FormControlProps;
type InputComponent = React.InputHTMLAttributes<HTMLInputElement> & InputProps;

export const Input = forwardRef<HTMLInputElement, InputComponent>(
  ({ errors, name, ...props }, ref) => (
    <div className="mb-4">
      <div className="mb-4">
        <input ref={ref} name={name} {...props} />
      </div>
      {name && errors && errors[name] ? (
        <ErrorMessage message={errors[name]} />
      ) : null}
    </div>
  )
);
