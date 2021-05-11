/* eslint-disable max-len*/
import React from 'react';

import { useForm } from 'react-hook-form';

/*
const socialMediaColors = {
  facebook: '#365397',
  linkedin: '#006db3',
  google: '#e0452c',
  github: '#2f2f2f',
};
*/

const ContactUs: React.FunctionComponent<any> = () => {
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
            <span className="text-default">Your name</span>

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

        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">Message</span>

            <textarea
              ref={register({ required: true })}
              name="message"
              className="text-xs form-textarea mt-1 block w-full"
              rows={3}
              placeholder="Your message"
            ></textarea>
          </label>
          {errors.message && (
            <p className="mt-1 text-xs text-red-500">Message is required</p>
          )}
        </div>

        <div className="w-full">
          <input
            type="submit"
            className="w-full block px-4 py-2 uppercase font-bold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 focus:outline-none active:outline-none"
            value="Submit"
          />
        </div>
      </form>
    </>
  );
};

export default ContactUs;
