import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

const socialMediaColors = {
  facebook: '#365397',
  linkedin: '#006db3',
  google: '#e0452c',
  github: '#2f2f2f',
};

const CreateAccount: React.FunctionComponent<any> = () => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data: any): void => {
    console.log(data);
  };
  const [checked, setChecked] = useState(true);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col text-sm mb-4"
      >
        {/* input*/}
        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">Name</span>

            <input
              name="name"
              type="text"
              ref={register({ required: true })}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="Enter your name"
            />
          </label>
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">Name is required</p>
          )}
        </div>

        {/* input*/}

        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">Email address</span>

            <input
              name="email"
              type="email"
              ref={register({ required: true })}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="Enter your email"
            />
          </label>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">Email is required</p>
          )}
        </div>

        {/* input*/}

        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">Password</span>

            <input
              name="password"
              type="password"
              ref={register({ required: true })}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="Enter your password"
            />
          </label>
          {errors.password && (
            <p className="mt-1 text-xs text-red-500">Password is required</p>
          )}
        </div>

        {/* input*/}

        <div className="w-full mb-4">
          <div className="inline-block">
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  name="terms"
                  ref={register()}
                  type="checkbox"
                  className="form-checkbox"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />

                <span className="ltr:ml-2 rtl:mr-2">
                  I agree to the{' '}
                  <Link href="/pages/terms-of-service">
                    <a className="link">Terms of service</a>
                  </Link>{' '}
                  and{' '}
                  <Link href="/pages/privacy-policy">
                    <a className="link">Privacy policy</a>
                  </Link>
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="w-full">
          <input
            type="submit"
            className="btn btn-default btn-block btn-indigo btn-rounded"
            value="Sign up"
          />
        </div>
      </form>

      <div className="w-full mb-4 text-center">
        <p className="text-secondary mb-2">Or sign up with</p>

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
        <span className="text-secondary">Already have an account?</span>

        <span>
          <Link href="/pages/login">
            <a className="link">Login here</a>
          </Link>
        </span>
      </div>

      <div className="w-full">
        <span>
          <Link href="/pages/forgot-password">
            <a className="link">Forgot password?</a>
          </Link>
        </span>
      </div>
    </>
  );
};

export default CreateAccount;
