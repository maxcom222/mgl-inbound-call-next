import React from 'react';

export const SingleLineList: React.FunctionComponent<any> = () => (
  <div className="flex items-center justify-start p-2">
    <p className="text-default text-sm font-normal">
      Lorem ipsum dolor sit amet
    </p>

    <div className="flex-shrink-0 self-center ml-auto">
      <span className="h-4 w-4 bg-blue-500 text-white flex items-center justify-center rounded-full text-xs">
        8
      </span>
    </div>
  </div>
);

export const MultiLineList: React.FunctionComponent<any> = () => (
  <div className="flex items-center justify-start p-2 text-sm">
    <div className="ml-0">
      <p className="text-default text-base">Lorem ipsum dolor sit amet</p>

      <p className="text-secondary text-sm">
        Sed ut perspiciatis unde omnis iste natus error
      </p>

      <p className="text-secondary text-xs">Dapibus ac facilisis in</p>
    </div>

    <div className="flex-shrink-0 self-start ltr:ml-2 rtl:mr-2">2 days ago</div>
  </div>
);

export const MediaList: React.FunctionComponent<any> = () => (
  <>
    <div className="flex items-center justify-start p-2">
      <div className="flex-shrink-0 w-12">
        <img
          src="/27.png"
          alt="image"
          className={'h-12 shadow-lg rounded-full w-full border-none relative'}
        />
      </div>

      <div className="ml-4 py-2">
        <p className="text-default text-sm font-bold">
          Lorem ipsum dolor sit amet
        </p>

        <p className="text-secondary text-xs">
          Sed ut perspiciatis unde omnis iste natus error Sed ut perspiciatis
          unde
        </p>
      </div>
    </div>

    <div className="flex items-center justify-start p-2">
      <div className="mr-4 py-2">
        <p className="text-default text-sm font-bold">
          Lorem ipsum dolor sit amet
        </p>

        <p className="text-secondary text-xs">
          Sed ut perspiciatis unde omnis iste natus error Sed ut perspiciatis
          unde
        </p>
      </div>

      <div className="flex-shrink-0 w-12">
        <img
          src="/27.png"
          alt="image"
          className={'h-12 shadow-lg rounded-full w-full border-none relative'}
        />
      </div>
    </div>
  </>
);
