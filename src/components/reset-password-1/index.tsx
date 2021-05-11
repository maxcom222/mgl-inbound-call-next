import React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

/*
const socialMediaColors = {
  facebook: '#365397',
  linkedin: '#006db3',
  google: '#e0452c',
  github: '#2f2f2f',
};
*/

const ResetPassword1: React.FunctionComponent<any> = () => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data: any): void => {
    console.log(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col text-sm mb-4"
      >
        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">New password</span>

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

        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">Confirm new password</span>

            <input
              name="passwordconfirmation"
              type="password"
              ref={register({ required: true })}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="Enter your password"
            />
          </label>

          {errors.passwordconfirmation && (
            <p className="mt-1 text-xs text-red-500">
              Password confirmation is required
            </p>
          )}
        </div>

        <div className="w-full">
          <input
            type="submit"
            className="btn btn-default btn-block btn-indigo btn-rounded"
            value="Sign up"
          />
        </div>
      </form>

      <div className="w-full children-x-1 mb-4">
        <span className="text-secondary">New user?</span>

        <span>
          <Link href="/pages/create-account">
            <a className="link">Sign up here</a>
          </Link>
        </span>
      </div>

      <div className="w-full children-x-1">
        <span className="text-secondary">Already have an account?</span>

        <span>
          <Link href="/pages/login">
            <a className="link">Login here</a>
          </Link>
        </span>
      </div>
    </>
  );
};

export default ResetPassword1;
