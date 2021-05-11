import React from 'react';
import {Tooltip} from 'react-tippy';
import * as Icon from 'react-feather';

const WidgetPannel: React.FunctionComponent<any> = (props: any) => {
  const paddingTop = typeof props.paddingTop === 'undefined' ? 'pt-5' : `pt-${props.paddingTop}`;
  const paddingBottom = typeof props.paddingBottom === 'undefined' ? 'pb-5' : `pb-${props.paddingBottom}`;

  return (
    <div className={`${paddingTop} ${paddingBottom}`}>
      <div className="flex flex-col widget-title w-full">
        <div className="flex justify-between title text-sm pb-2 font-sm font-poppins">
          <div className="flex">
            <div className="flex items-center mr-16">
              <span className="mr-1">{typeof props.title !== 'undefined' ? props.title : ''}</span>
              {typeof props.tooltip !== 'undefined' &&
                <Tooltip
                  title={props.tooltip}
                  position="right"
                  arrow={true}
                  duration={0}
                  hideDuration={0}
                >
                  <Icon.HelpCircle size={13} />
                </Tooltip>
              }
            </div>
            {typeof props.headerLeft !== 'undefined' &&
              props.headerLeft
            }
          </div>
          <div>
            {typeof props.headerRight !== 'undefined' &&
              props.headerRight
            }
          </div>
        </div>
        <hr />
      </div>
      <div
        className={
          typeof props.paddingTop === 'undefined' ? 'pt-8' : `pt-${props.paddingTop}`
        }>
          {props.children}
        </div>
    </div>
  );
};

export default WidgetPannel;
