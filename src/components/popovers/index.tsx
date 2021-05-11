import React, { createRef, useState } from 'react';
import Popper from 'popper.js';

// const placements = ['auto', 'top', 'right', 'bottom', 'left']; // -start, -end

export const Popover: React.FunctionComponent<any> = ({
  placement,
  title,
  content,
  children,
}: any) => {
  const [popoverShow, setPopoverShow] = useState(false);
  const btnRef = createRef<HTMLButtonElement>();
  const popoverRef = createRef<HTMLDivElement>();
  const openPopover = (): void => {
    // @ts-ignore
    new Popper(btnRef.current, popoverRef.current, {
      placement,
    });
    setPopoverShow(true);
  };
  const closePopover = (): void => {
    setPopoverShow(false);
  };
  /*
  let margin = 'm-0';
  if (placement === 'left') margin = 'mr-2';
  if (placement === 'right') margin = 'ml-2';
  if (placement === 'top') margin = 'mb-2';
  if (placement === 'bottom') margin = 'mt-2';
  */

  return (
    <>
      <button
        className="btn btn-default btn-rounded"
        type="button"
        onClick={() => (popoverShow ? closePopover() : openPopover())}
        ref={btnRef}
      >
        {children}
      </button>

      <div
        className={`popover ${popoverShow ? 'popover-show ' : ''}`}
        ref={popoverRef}
      >
        <div className="popover-title">{title}</div>

        <div className="popover-content">{content}</div>
      </div>
    </>
  );
};

export const Tooltip: React.FunctionComponent<any> = ({
  placement,
  content,
  children,
}: any) => {
  const [tooltipShow, setPopoverShow] = useState(false);
  const btnRef = createRef<HTMLButtonElement>();
  const tooltipRef = createRef<HTMLDivElement>();
  const openPopover = (): void => {
    // @ts-ignore
    new Popper(btnRef.current, tooltipRef.current, {
      placement,
    });
    setPopoverShow(true);
  };
  const closePopover = (): void => {
    setPopoverShow(false);
  };

  /*
  let margin = 'm-0';
  if (placement === 'left') margin = 'mr-2';
  if (placement === 'right') margin = 'ml-2';
  if (placement === 'top') margin = 'mb-2';
  if (placement === 'bottom') margin = 'mt-2';
  */

  return (
    <>
      <button
        className="btn btn-default btn-rounded"
        type="button"
        onMouseEnter={openPopover}
        onMouseLeave={closePopover}
        onClick={() => (tooltipShow ? closePopover() : openPopover())}
        ref={btnRef}
      >
        {children}
      </button>

      <div
        className={`tooltip ${tooltipShow ? 'tooltip-show ' : ''}`}
        ref={tooltipRef}
      >
        <div className="tooltip-content">{content}</div>
      </div>
    </>
  );
};
