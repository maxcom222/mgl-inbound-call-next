import React from 'react';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
// import { gql, useMutation } from '@apollo/client';
import Link from 'next/link';
import { Input } from '../general/form';
import { useYupForm } from '../../hooks';
import { actionAuthenticate } from '../../../store/global/actions';
import { authProvider } from '../../auth';

const socialMediaColors = {
  facebook: '#365397',
  linkedin: '#006db3',
  google: '#e0452c',
  github: '#2f2f2f',
};

type LoginData = {
  readonly email: string;
  readonly password: string;
};

type LoginFormProps = {
  readonly onSubmit: () => void;
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6),
});

// const LOGIN_MUTATION = gql`
//   mutation LoginMutation($email: String!, $password: String!) {
//     login(email: $email, password: $password) {
//       token
//     }
//   }
// `;

const LoginFormInternal: React.FunctionComponent<LoginFormProps> = ({
  onSubmit,
}) => {
  // const [loginAction] = useMutation(LOGIN_MUTATION);

  const { register, handleSubmit, errors } = useYupForm<LoginData>({
    validationSchema: schema,
  });

  const dispath = useDispatch();
  const onSuccess = (values: LoginData): void => {
    // loginAction({
    //   variables: {
    //     email: values.email,
    //     password: values.password
    //   }
    // });

    void authProvider
      .login({
        email: values.email,
        password: values.password,
      })
      .then((user) => {
        dispath(actionAuthenticate(user));
        onSubmit();
      });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSuccess)}
        className="flex flex-col text-sm mb-4 w-full"
      >
        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">Email</span>
            <Input
              name="email"
              type="email"
              ref={register}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="Enter your email"
            />
          </label>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">Password</span>

            <Input
              name="password"
              type="password"
              ref={register}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="Enter your password"
            />
          </label>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
          )}
        </div>

        <div className="w-full">
          <input
            type="submit"
            className="
              px-8 py-2 w-full uppercase text-white bg-indigo-700 rounded
              hover:bg-indigo-800 focus:outline-none active:outline-none"
            value="Login"
            style={{
              cursor: 'pointer',
            }}
          />
        </div>
      </form>

      <div className="w-full mb-4 text-center">
        <p className="text-secondary mb-2">Or login with</p>

        <div className="flex w-full flex-row justify-center items-center children-x-2">
          <i
            className={'icon-social-facebook text-xl'}
            style={{ color: socialMediaColors.facebook }}
          ></i>

          <i
            className={'icon-social-google text-xl'}
            style={{ color: socialMediaColors.google }}
          ></i>

          <i
            className={'icon-social-linkedin text-xl'}
            style={{ color: socialMediaColors.linkedin }}
          ></i>

          <i
            className={'icon-social-github text-xl'}
            style={{ color: socialMediaColors.github }}
          ></i>
        </div>
      </div>

      <div className="w-full children-x-1">
        <span className="text-secondary">New user?</span>

        <span>
          <Link href="/signup">
            <a className="link">Create account here</a>
          </Link>
        </span>
      </div>

      <div className="w-full">
        <span>
          <Link href="/forgot-password">
            <a className="link">Forgot password?</a>
          </Link>
        </span>
      </div>
    </>
  );
};

export const LoginForm = LoginFormInternal;
