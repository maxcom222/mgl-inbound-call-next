import React from 'react';
import Switch from 'react-switch';
import { getColor } from 'functions/colors';

const Component: React.FunctionComponent<any> = (props) => {
  const onColor = `bg-${typeof props.color === 'undefined' ? 'blue' : props.color}-300`;
  const onHandleColor = `bg-${typeof props.color === 'undefined' ? 'blue' : props.color}-500`;
  const offColor = 'bg-gray-400';
  const offHandleColor = 'bg-white';

  return (
    <>
      <div>
        <Switch
          onChange={(c) => typeof props.onChange !== 'undefined' ? props.onChange(c) : false }
          checked={props.checked ? true : false}
          disabled={typeof props.disabled !== 'undefined' ? props.disabled : false}
          onColor={getColor(onColor)}
          onHandleColor={getColor(onHandleColor)}
          offColor={getColor(offColor)}
          offHandleColor={getColor(offHandleColor)}
          handleDiameter={24}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
          className={`react-switch  ${typeof props.size !== 'undefined' ? props.size : ''}`}
        />
      </div>

      <style jsx>{`
        .react-switch {
          vertical-align: middle;
          margin-left: 4px;
        }
      `}</style>
    </>
  );
};

export default Component;
