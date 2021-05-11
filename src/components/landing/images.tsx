import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';

const Images: React.FunctionComponent<any> = () => {
  const { direction } = useSelector(
    (state: any) => ({
      direction: state.global.direction,
    }),
    shallowEqual
  );
  const items = [
    '/screenshots/8.png',
    '/screenshots/5.png',
    '/screenshots/9.png',
  ];

  return (
    <div
      className="screenshot overflow-hidden w-full rounded relative shadow-lg"
      style={{ height: 320 }}
    >
      <img
        src={
          direction === 'ltr' ? items[0] : items[0].replace('.png', '-rtl.png')
        }
        alt="screenshot"
        className="z-0 h-auto w-full absolute"
        style={{ top: 0, left: 0 }}
      />

      <img
        src={
          direction === 'ltr' ? items[1] : items[1].replace('.png', '-rtl.png')
        }
        alt="screenshot"
        className="z-10 shadow h-auto w-full absolute"
        style={{ top: 50, left: direction === 'ltr' ? 50 : -50 }}
      />

      <img
        src={
          direction === 'ltr' ? items[2] : items[2].replace('.png', '-rtl.png')
        }
        alt="screenshot"
        className="z-10 shadow h-auto w-full absolute"
        style={{ top: 100, left: direction === 'ltr' ? 100 : -100 }}
      />
    </div>
  );
};

export default Images;
