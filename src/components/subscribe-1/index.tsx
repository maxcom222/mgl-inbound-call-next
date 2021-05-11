/* eslint-disable max-len */
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

const Subscribe: React.FunctionComponent<any> = () => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data: any): void => {
    console.log(data);
  };

  // const [checked, setChecked] = useState(true);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col text-sm mb-4"
      >
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

        <div className="w-full">
          <input
            type="submit"
            className="w-full block px-4 py-2 uppercase font-bold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:outline-none active:outline-none"
            value="Subscribe"
          />
        </div>
      </form>

      <div className="w-full">
        <span>
          <Link href="/pages/login">
            <a className="text-blue-500 hover:text-blue-800">
              Go back to login
            </a>
          </Link>
        </span>
      </div>
    </>
  );
};

export default Subscribe;
