/* eslint-disable id-blacklist */
import { setLocale, Schema, ValidationError } from 'yup';
import {
  useForm,
  ValidationResolver,
  UseFormOptions,
  FormContextValues,
} from 'react-hook-form';

type TranslateFunction = (
  key: string | readonly (string | number)[],
  params?: any,
  lang?: string
) => string;

export function initYup(): void {
  return setLocale({
    mixed: {
      default: 'validation.mixed.default',
      required: 'validation.mixed.required',
      oneOf: 'validation.mixed.oneOf',
      notOneOf: 'validation.mixed.notOneOf',
    },
    number: {
      min: 'validation.number.min',
      max: 'validation.number.max',
    },
    string: {
      min: 'validation.string.min',
      max: 'validation.string.max',
    },
  });
}

const resolver: <T extends Record<string, any> = Record<string, any>>(
  i18n,
  schema: Schema<T>
) => ValidationResolver<T> = (
  { t }: { readonly t: TranslateFunction },
  schema
) => (data) =>
  schema
    .validate(data, {
      abortEarly: false,
    })
    .then((values) => ({
      values,
      errors: {},
    }))
    .catch((err: ValidationError) => ({
      values: {},
      errors: err.inner.reduce(
        (r, o) => ({
          ...r,
          [o.path]: t(o.message, {
            ...o.params,
            path: t(`general.${o.path}`),
          }),
        }),
        {}
      ),
    }));

export type UseYupForm = <F extends Record<string, any> = Record<string, any>>(
  options: UseFormOptions<F>
) => FormContextValues<F>;

export function initializeYupForm({ i18n }) {
  return <F extends Record<string, any> = Record<string, any>>({
    validationSchema,
    ...options
  }: UseFormOptions<F>) =>
    useForm({
      ...options,
      validationResolver: resolver(i18n, validationSchema),
    });
}

initYup();
