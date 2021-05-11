import React, { useState } from 'react';

export const Collapse: React.FunctionComponent<any> = (props) => {
  const [open, setOpen] = useState(false);

  return(
    <div className={`collapse-wrapper mb-3 ${open ? 'open' : ''}`}>
      <a
        className="collapse-arrow block cursor-pointer text-black"
        onClick={() => setOpen(!open)}
      >
        {props.label}
      </a>
      <div className="collapse-body pt-2">
        {props.children}
      </div>
    </div>
  );
}