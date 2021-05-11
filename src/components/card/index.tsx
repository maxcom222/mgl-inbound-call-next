import React from 'react';

const Card: React.FunctionComponent<any> = ({
  children,
  borderLeft = false,
  borderTop = false
}: any) => {
  const style:any = {};

  if(borderLeft) style.borderLeft = 'solid 3px #38a169';
  if(borderTop) style.borderTop = 'solid 3px #38a169';

  return (
    <div
      className="card w-full mb-2"
      style={style}
    >
      <div className="p-3 w-full">
        {children}
      </div>
    </div>
  );
};

export default Card;