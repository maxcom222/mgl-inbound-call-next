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
            <span className="text-default">Current password</span>

            <input
              name="currentpassword"
              type="password"
              ref={register({ required: true })}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder="********"
            />
          </label>
          {errors.currentpassword && (
            <p className="mt-1 text-xs text-red-500">
              Current password is required
            </p>
          )}
        </div>

        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">New password</span>

            <input
              name="newpassword"
              type="password"
              ref={register({ required: true })}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder=""
            />
          </label>
          {errors.newpassword && (
            <p className="mt-1 text-xs text-red-500">
              New password is required
            </p>
          )}
        </div>

        <div className="w-full mb-4">
          <label className="block">
            <span className="text-default">Confirm new password</span>

            <input
              name="confirmnewpassword"
              type="password"
              ref={register({ required: true })}
              className="form-input mt-1 text-xs block w-full bg-white"
              placeholder=""
            />
          </label>
          {errors.confirmnewpassword && (
            <p className="mt-1 text-xs text-red-500">
              New password confirmation is required
            </p>
          )}
        </div>

        <div className="w-full">
          <input
            type="submit"
            className="px-4 py-2 uppercase font-bold text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:outline-none active:outline-none"
            value="Update"
          />
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;
