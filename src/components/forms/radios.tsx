import React from 'react';

export const Radio: React.FunctionComponent<any> = () => (
  <div className="flex flex-col">
    <div className="text-default mb-1">Label</div>

    <div className="flex items-center justify-start mb-1">
      <label className="inline-flex items-center children-x-2">
        <input
          type="radio"
          value="0"
          name="r1"
          className="form-radio text-blue-500 h-4 w-4"
          checked
        />

        <span>Option 1</span>
      </label>

      <label className="inline-flex items-center children-x-2">
        <input
          type="radio"
          value="1"
          name="r1"
          className="form-radio text-blue-500 h-4 w-4"
        />

        <span>Option 2</span>
      </label>
    </div>

    <p className="text-xs text-secondary">This is a hint</p>
  </div>
);

export const InvalidRadio: React.FunctionComponent<any> = () => (
  <div className="flex flex-col">
    <div className="text-default mb-1">Label</div>

    <div className="flex items-center justify-start mb-1">
      <label className="inline-flex items-center children-x-2">
        <input
          type="radio"
          value="0"
          name="r2"
          className="form-radio text-red-500 h-4 w-4"
          checked
        />

        <span>Option 1</span>
      </label>

      <label className="inline-flex items-center children-x-2">
        <input
          type="radio"
          value="1"
          name="r2"
          className="form-radio text-red-500 h-4 w-4"
        />

        <span>Option 2</span>
      </label>
    </div>

    <p className="text-xs text-red-500">Option is required</p>
  </div>
);

export const ValidRadio: React.FunctionComponent<any> = () => (
  <div className="flex flex-col">
    <div className="text-default mb-1">Label</div>

    <div className="flex items-center justify-start mb-1">
      <label className="inline-flex items-center children-x-2">
        <input
          type="radio"
          value="0"
          name="r3"
          className="form-radio text-green-500 h-4 w-4"
          checked
        />

        <span>Option 1</span>
      </label>

      <label className="inline-flex items-center children-x-2">
        <input
          type="radio"
          value="1"
          name="r3"
          className="form-radio text-green-500 h-4 w-4"
        />

        <span>Option 2</span>
      </label>
    </div>

    <p className="text-xs text-green-500">Option is required</p>
  </div>
);
