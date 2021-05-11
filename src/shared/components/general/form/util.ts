import { NestDataObject, FieldError } from 'react-hook-form';

export type FormErrors = NestDataObject<Record<string, any>, FieldError>;
export type FormControlProps = {
  readonly errors?: FormErrors;
};
