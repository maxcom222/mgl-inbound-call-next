/* eslint-disable max-len */
import React from 'react';
import { useForm } from 'react-hook-form';

const AccountSettings: React.FunctionComponent<any> = () => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data: any): void => {
    console.log(data);
  };

  // const [checked, setChecked] = useState(true);

  return (
    <div className="w-full lg:w-1/3">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col text-sm mb-4"
      >
        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">Current email</span>

            <input
              name="currentemail"
              type="email"
              ref={register({ required: true })}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="your@email.com"
            />
          </label>
          {errors.currentemail && (
            <p className="mt-1 text-xs text-red-500">
              Current email is required
            </p>
          )}
        </div>

        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">New email</span>

            <input
              name="newemail"
              type="email"
              ref={register({ required: true })}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder=""
            />
          </label>
          {errors.newemail && (
            <p className="mt-1 text-xs text-red-500">New email is required</p>
          )}
        </div>

        <div className="flex flex-col mb-4">
          <div className="text-default mb-1">Daily updates</div>

          <div className="flex items-center justify-start mb-1">
            <label className="inline-flex items-center children-x-2">
              <input
                ref={register()}
                type="radio"
                value="0"
                name="r1"
                className="form-radio text-blue-500 h-4 w-4"
                checked
              />

              <span>Yes</span>
            </label>

            <label className="inline-flex items-center children-x-2">
              <input
                ref={register()}
                type="radio"
                value="1"
                name="r1"
                className="form-radio text-blue-500 h-4 w-4"
              />

              <span>No</span>
            </label>
          </div>
        </div>

        <div className="flex flex-col mb-4">
          <div className="text-default mb-1">Weekly updates</div>

          <div className="flex items-center justify-start mb-1">
            <label className="inline-flex items-center children-x-2">
              <input
                ref={register()}
                type="radio"
                value="0"
                name="r2"
                className="form-radio text-blue-500 h-4 w-4"
                checked
              />

              <span>Yes</span>
            </label>

            <label className="inline-flex items-center children-x-2">
              <input
                ref={register()}
                type="radio"
                value="1"
                name="r2"
                className="form-radio text-blue-500 h-4 w-4"
              />

              <span>No</span>
            </label>
          </div>
        </div>

        <div className="w-full">
          <input
            type="submit"
            className="px-4 py-2 uppercase font-bold text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none active:outline-none"
            value="Submit"
          />
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
