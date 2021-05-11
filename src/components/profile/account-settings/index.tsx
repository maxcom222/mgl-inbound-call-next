/* eslint-disable max-len */
import React from 'react';
import { useForm } from 'react-hook-form';

const AccountSettings: React.FunctionComponent<any> = () => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data): void => {
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
            <span className="text-default">First name</span>

            <input
              name="firstname"
              type="text"
              ref={register({ required: true })}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="Eric"
            />
          </label>
          {errors.firstname && (
            <p className="mt-1 text-xs text-red-500">First name is required</p>
          )}
        </div>

        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">Last name</span>

            <input
              name="lastname"
              type="text"
              ref={register({ required: true })}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="Simpson"
            />
          </label>
          {errors.lastname && (
            <p className="mt-1 text-xs text-red-500">Last name is required</p>
          )}
        </div>

        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">Company</span>

            <input
              name="company"
              type="text"
              ref={register({ required: true })}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="Facebook"
            />
          </label>
          {errors.company && (
            <p className="mt-1 text-xs text-red-500">Company is required</p>
          )}
        </div>

        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">Position</span>

            <input
              name="position"
              type="text"
              ref={register({ required: true })}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="Innovation pioneer"
            />
          </label>
          {errors.position && (
            <p className="mt-1 text-xs text-red-500">Position is required</p>
          )}
        </div>

        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">Select</span>

            <select
              name="language"
              ref={register()}
              className="form-select block w-full mt-1 text-xs"
            >
              <option value="0">Choose your language</option>

              <option value="1">English</option>

              <option value="2">Spanish</option>

              <option value="3">Portuguese</option>

              <option value="4">Chinese</option>
            </select>
          </label>
          {errors.language && (
            <p className="mt-1 text-xs text-red-500">Language is required</p>
          )}
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
