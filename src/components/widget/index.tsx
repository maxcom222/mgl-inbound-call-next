import React from 'react';

const Widget: React.FunctionComponent<any> = ({
  title,
  right = null,
  children,
  headerLeft,
  headerRight,
  paddingTop = null
}: any) => {
  if (right) {
    return (
      <div className="w-full p-6 shadow mb-6 widget">
        <div className="flex flex-row items-center justify-between">
          {typeof title !== 'undefined' &&
            <div className="flex justify-between items-center widget-title w-full">
              <div className="flex title text-lg font-base font-poppins">
                <div>
                  {title}
                </div>
                {typeof headerLeft !== 'undefined' &&
                  headerLeft
                }
              </div>

              {typeof headerRight !== 'undefined' &&
                headerRight
              }
            </div>
          }
          {right}
        </div>
        { typeof children !== 'undefined' &&
          <div className={(typeof title !== 'undefined' && paddingTop === null) ? `mt-10` : paddingTop}>
            {children}
          </div>
        }
      </div>
    );
  }

  return (
    <div className="w-full p-6 shadow mb-6 widget">
      {typeof title !== 'undefined' &&
        <div className="flex justify-between items-center widget-title w-full">
          <div className="flex title text-lg font-base font-poppins">
            <div>
              {title}
            </div>
            {typeof headerLeft !== 'undefined' &&
              headerLeft
            }
          </div>

          {typeof headerRight !== 'undefined' &&
            headerRight
          }
        </div>
      }
      { typeof children !== 'undefined' &&
        <div className={(typeof title !== 'undefined' && paddingTop === null) ? `mt-10` : paddingTop}>
          {children}
        </div>
      }
    </div>
  );
};

export default Widget;
