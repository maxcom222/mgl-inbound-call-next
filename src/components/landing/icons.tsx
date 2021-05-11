import React from 'react';

const Icons: React.FunctionComponent<any> = () => (
  <div className="flex flex-row children-x-1">
    <img src="/logos/react.svg" alt="react" className="h-6 w-auto" />

    <img src="/logos/nextjs.svg" alt="nextjs" className="h-6 w-auto" />

    <img src="/logos/redux.svg" alt="redux" className="h-6 w-auto" />

    <img src="/logos/sass.svg" alt="sass" className="h-6 w-auto" />

    <img
      src="/logos/tailwind-css.svg"
      alt="tailwind-css"
      className="h-6 w-auto"
    />
  </div>
);

export default Icons;
