import React from 'react';

export const Checkbox: React.FunctionComponent<any> = () => (
  <div className="flex flex-col">
    <div className="text-default mb-1">Label</div>

    <div className="flex items-center justify-start mb-1">
      <label className="inline-flex items-center children-x-2">
        <input
          type="checkbox"
          value="0"
          name="r1"
          className="form-checkbox text-blue-500 h-4 w-4"
        />

        <span>Option 1</span>
      </label>

      <label className="inline-flex items-center children-x-2">
        <input
          type="checkbox"
          value="1"
          name="r1"
          className="form-checkbox text-blue-500 h-4 w-4"
        />

        <span>Option 2</span>
      </label>
    </div>

    <p className="text-xs text-secondary capitalize">This is a hint</p>
  </div>
);

export const InvalidCheckbox: React.FunctionComponent<any> = () => (
  <div className="flex flex-col">
    <div className="text-default mb-1">Label</div>

    <div className="flex items-center justify-start mb-1">
      <label className="inline-flex items-center children-x-2">
        <input
          type="checkbox"
          value="0"
          name="r2"
          className="form-checkbox text-red-500 h-4 w-4"
        />

        <span>Option 1</span>
      </label>

      <label className="inline-flex items-center children-x-2">
        <input
          type="checkbox"
          value="1"
          name="r2"
          className="form-checkbox text-red-500 h-4 w-4"
        />

        <span>Option 2</span>
      </label>
    </div>

    <p className="text-xs text-red-500 invalid">Option is required</p>
  </div>
);

export const ValidCheckbox: React.FunctionComponent<any> = () => (
  <div className="flex flex-col">
    <div className="text-default mb-1">Label</div>

    <div className="flex items-center justify-start mb-1">
      <label className="inline-flex items-center children-x-2">
        <input
          type="checkbox"
          value="0"
          name="r3"
          className="form-checkbox text-green-500 h-4 w-4"
        />

        <span>Option 1</span>
      </label>

      <label className="inline-flex items-center children-x-2">
        <input
          type="checkbox"
          value="1"
          name="r3"
          className="form-checkbox text-green-500 h-4 w-4"
        />

        <span>Option 2</span>
      </label>
    </div>

    <p className="text-xs text-green-500 capitalize">Option is required</p>
  </div>
);
