import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Switch from 'react-switch';
import ClickOutside from 'react-click-outside';

import Help from 'components/help';
import { getColor, toRGB } from 'functions/colors';

export const InlineTextInput: React.FunctionComponent<any> = (props) => {
  const value = (typeof props.value !== 'undefined' && props.value !== null) ? props.value : '';
  const border = typeof props.borderUnderline !== 'undefined' && props.borderUnderline ? 'border-underline' : 'border';
  const tooltip = typeof props.tooltip !== 'undefined' ? props.tooltip : '';

  let width = '72';

  if(typeof props.width !== 'undefined'){
    if(props.width === 'xs'){
      width = '12';
    }else if(props.width === 'sm'){
      width = '24';
    }else if(props.width === 'lg'){
      width = '84';
    }else if(props.width === 'full'){
      width = 'full';
    }
  }

  return (
    <div className={props.className}>
      <div className="row">
        <div className={`col-md-${props.mdLabel} col-xs-12 flex md:justify-end items-center`}>
          <label className="flex items-center pb-2 md:pb-0">
            <span className="text-sm text-default whitespace-no-wrap mr-1">{props.label}</span>
            {tooltip !== '' &&
              <Help>{tooltip}</Help>
            }
          </label>
        </div>
        <div className={`col-md-${props.mdInput} col-xs-12 md:flex items-center`}>
          <input
            name={props.name}
            type={typeof props.type === 'undefined' ? 'text' : props.type}
            className={`text-sm form-input block ${border} w-full md:w-${width}`}
            placeholder={props.placeholder}
            value={value}
            min={typeof props.min !== 'undefined' ? props.min : ''}
            max={typeof props.max !== 'undefined' ? props.max : ''}
            onChange={(e) => {
              if(typeof props.onChange !== 'undefined') props.onChange(e.target.value);
            }}
          />

          {typeof props.error !== 'undefined' && props.error !== '' && (
            <p className="text-xs text-red-500 invalid mt-1 md:ml-4 md:mt-0">{props.error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const InlineNumberInput: React.FunctionComponent<any> = (props) => {
  const value = (typeof props.value !== 'undefined' && props.value !== null) ? props.value : '';
  const min = typeof props.min !== 'undefined' ? props.min : null;
  const max = typeof props.max !== 'undefined' ? props.max : null;
  const integer = typeof props.integer !== 'undefined' ? props.integer : false;
  const tooltip = typeof props.tooltip !== 'undefined' ? props.tooltip : '';

  let width = '72';

  if(typeof props.width !== 'undefined'){
    if(props.width === 'xs'){
      width = '12';
    }else if(props.width === 'sm'){
      width = '24';
    }else if(props.width === 'lg'){
      width = '84';
    }else if(props.width === 'full'){
      width = 'full';
    }
  }

  const validate = (v):boolean => {
    let isValidate = true;

    if(v !== ''){
      if(Number(v).toString() !== v){
        isValidate = false;
      }

      if(min !== null){
        if(Number(v) < min){
          isValidate = false;
        }
      }

      if(max !== null){
        if(Number(v) > max){
          isValidate = false;
        }
      }
    }

    return isValidate;
  }

  return (
    <div className={props.className}>
      <div className="row">
        <div className={`col-md-${props.mdLabel} col-xs-12 flex md:justify-end items-center`}>
          <label className="flex items-center pb-2 md:pb-0">
            <span className="text-sm text-default whitespace-no-wrap mr-1">{props.label}</span>
            {tooltip !== '' &&
              <Help>{tooltip}</Help>
            }
          </label>
        </div>
        <div className={`col-md-${props.mdInput} col-xs-12 md:flex items-center`}>
          <input
            name={props.name}
            type="number"
            className={`text-sm form-input block border-underline w-full md:w-${width}`}
            placeholder={props.placeholder}
            value={value}
            onKeyDown={(e) => {
              if(e.key === 'e') e.preventDefault();

              if(integer){
                if(e.key === '.'){
                  e.preventDefault();
                }
              }

              if(min === 0){
                if(e.key === '-'){
                  e.preventDefault();
                }
              }
            }}
            onChange={(e) => {
              if(validate(e.target.value) && typeof props.onChange !== 'undefined') props.onChange(e.target.value);
            }}
          />

          {typeof props.error !== 'undefined' && props.error !== '' && (
            <p className="text-xs text-red-500 invalid mt-1 md:ml-4 md:mt-0">{props.error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const InlinePhoneInput: React.FunctionComponent<any> = (props) => {
  const value = (typeof props.value !== 'undefined' && props.value !== null) ? props.value : '';
  const includes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace', 'Delete'];
  const tooltip = typeof props.tooltip !== 'undefined' ? props.tooltip : '';

  const handleChange = (v):void => {
    let newValue = v;

    if(newValue !== ''){
      newValue = `+${newValue.replace('+', '')}`;
    }

    if(typeof props.onChange !== 'undefined'){
      props.onChange(newValue);
    }
  }

  return (
    <div className={props.className}>
      <div className="row">
        <div className={`col-md-${props.mdLabel} col-xs-12 flex md:justify-end items-center`}>
          <label className="flex items-center pb-2 md:pb-0">
            <span className="text-sm text-default whitespace-no-wrap mr-1">{props.label}</span>
            {tooltip !== '' &&
              <Help>{tooltip}</Help>
            }
          </label>
        </div>
        <div className={`col-md-${props.mdInput} col-xs-12 md:flex items-center`}>
          <input
            name={props.name}
            className="text-sm form-input block border-underline w-full md:w-72"
            placeholder={props.placeholder}
            value={value}
            onKeyDown={(e) => {
              if(!includes.includes(e.key)){
                e.preventDefault();
              }
            }}
            onChange={(e) => handleChange(e.target.value)}
          />

          {typeof props.error !== 'undefined' && props.error !== '' && (
            <p className="text-xs text-red-500 invalid mt-1 md:ml-4 md:mt-0">{props.error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const InlineSelect: React.FunctionComponent<any> = (props) => {
  let initialSelectedOption = {
    label: '',
    value: ''
  };
  if(typeof props.value !== 'undefined' && props.options.findIndex((el) => el.value === props.value) !== -1){
    initialSelectedOption = props.options[props.options.findIndex((el) => el.value === props.value)];
  }
  const [ selectedOption, setSelectedOption ] = useState(initialSelectedOption);
  const [ isOpen, setIsOpen ] = useState(false);
  const [ isFocus, setIsFocus ] = useState(false);
  const tooltip = typeof props.tooltip !== 'undefined' ? props.tooltip : '';
  useEffect(() => {
    if(typeof props.onChange !== 'undefined') props.onChange(selectedOption.value);
  }, [ selectedOption ]);

  return (
    <div className={props.className}>
      <div className="row">
        <div className={`col-md-${props.mdLabel} col-xs-12 flex md:justify-end items-center`}>
          <label className="flex items-center pb-2 md:pb-0">
            <span className="text-sm text-default whitespace-no-wrap mr-1">{props.label}</span>
            {tooltip !== '' &&
              <Help>{tooltip}</Help>
            }
          </label>
        </div>
        <div className={`col-md-${props.mdInput} col-xs-12 md:flex items-center`}>
          <ClickOutside onClickOutside={() => {
            setIsOpen(false);
            setIsFocus(false);
          }}>
            <div
              className={`
                common-select-dropdown-wrapper
                ${isFocus ? 'focus' : ''}
                ${typeof props.size !== 'undefined' ? `size-${props.size}` : ''}`
              }
            >
              <div className="common-select-dropdown-control flex justify-between text-sm block border w-full md:w-72"
                onClick={() => {
                  setIsOpen(!isOpen);
                  setIsFocus(true);
                }}
              >
                <div className={`common-select-dropdown-text ${selectedOption.value !== '' ? 'active' : ''}`}>
                  { (() => {
                    if(selectedOption.value !== ''){
                      return selectedOption.label;
                    }
                    if(typeof props.placeholder !== 'undefined'){
                      return props.placeholder;
                    }

                    return 'Select..';
                  })()}
                </div>
                <div className="common-select-dropdown-indicator-wrapper">
                  <svg
                    height="20"
                    width="20"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d="
                        M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481
                        1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695
                        4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0
                        0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z
                      "
                    >
                    </path>
                  </svg>
                </div>
              </div>
              {isOpen &&
                <div className="common-select-dropdown">
                  {
                    props.options.map((el, key) => (
                      <div
                        key={key}
                        className={`
                          common-select-dropdown-item
                          ${(selectedOption !== null && selectedOption.value === el.value) ? 'active' : ''}
                        `}
                        onClick={() => {
                          setSelectedOption(el);
                          setIsOpen(false);
                          setIsFocus(true);
                        }}
                      >
                        {el.label}
                      </div>
                    ))
                  }
                </div>
              }
            </div>
          </ClickOutside>

          {typeof props.error !== 'undefined' && props.error !== '' && (
            <p className="text-xs text-red-500 invalid mt-1 md:ml-4 md:mt-0">{props.error}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const InlineSwitch: React.FunctionComponent<any> = (props) => {
  const tooltip = typeof props.tooltip !== 'undefined' ? props.tooltip : '';
  const onColor = `bg-${typeof props.color === 'undefined' ? 'blue' : props.color}-300`;
  const onHandleColor = `bg-${typeof props.color === 'undefined' ? 'blue' : props.color}-500`;
  const offColor = 'bg-gray-400';
  const offHandleColor = 'bg-white';

  return (
    <>
      <div className={props.className}>
        <div className="row">
          <div className={`col-md-${props.mdLabel} col-xs-12 flex md:justify-end items-center`}>
          <label className="flex items-center pb-2 md:pb-0">
            <span className="text-sm text-default whitespace-no-wrap mr-1">{props.label}</span>
            {tooltip !== '' &&
              <Help>{tooltip}</Help>
            }
          </label>
          </div>
          <div className={`col-md-${props.mdInput} col-xs-12 md:flex items-center`}>
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
              className={`react-switch ${typeof props.size !== 'undefined' ? props.size : ''}`}
            />

            {typeof props.error !== 'undefined' && props.error !== '' && (
              <p className="text-xs text-red-500 invalid mt-1 md:ml-4 md:mt-0">{props.error}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const InlineTextSwitch: React.FunctionComponent<any> = (props) => {
  const tooltip = typeof props.tooltip !== 'undefined' ? props.tooltip : '';
  const onColor = `bg-${typeof props.color === 'undefined' ? 'blue' : props.color}-300`;
  const onHandleColor = `bg-${typeof props.color === 'undefined' ? 'blue' : props.color}-500`;
  const offColor = 'bg-gray-400';
  const offHandleColor = 'bg-white';
  const style:any = {};
  if(props.fixWidth) style.width = '206px';

  return (
    <>
      <div className={props.className}>
        <div className="row">
          <div className={`col-md-${props.mdLabel} col-xs-12 flex md:justify-end items-center`}>
          <label className="flex items-center pb-2 md:pb-0">
            <span className="text-sm text-default whitespace-no-wrap mr-1">{props.label}</span>
            {tooltip !== '' &&
              <Help>{tooltip}</Help>
            }
          </label>
          </div>
          <div className={`col-md-${props.mdInput} col-xs-12 md:flex items-center`}>
            <Switch
              onChange={(c) => {
                if(typeof props.onChange !== 'undefined'){
                  if(c){
                    props.onChange('');
                  }else{
                    props.onChange(props.unsetValue);
                  }
                }
              }}
              checked={props.unsetValue !== props.value ? true : false}
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
              className={`react-switch ${typeof props.size !== 'undefined' ? props.size : ''}`}
            />

            {props.value !== props.unsetValue
              ? (
                <div className="ml-16">
                  <input
                    type={typeof props.type !== 'undefined' ? props.type : 'text'}
                    className="form-input border-underline text-sm block p-1 w-24"
                    placeholder={props.placeholder}
                    value={props.value === null ? '' : props.value}
                    min={typeof props.min !== 'undefined' ? props.min : ''}
                    max={typeof props.max !== 'undefined' ? props.max : ''}
                    onChange={(e) => {
                      const value = e.target.value;

                      if(typeof props.onChange !== 'undefined'){
                        props.onChange(value);
                      }
                    }}
                    style={style}
                  />
                </div>
              )
              : (
                <p className="text-sm ml-16">None</p>
              )
            }

            {typeof props.error !== 'undefined' && props.error !== '' && (
              <p className="text-xs text-red-500 invalid mt-1 md:ml-4 md:mt-0">{props.error}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const InlineText: React.FunctionComponent<any> = (props) => {
  const tooltip = typeof props.tooltip !== 'undefined' ? props.tooltip : '';

  return (
    <div className={props.className}>
      <div className="row">
        <div className={`col-md-${props.mdLabel} col-xs-12 flex md:justify-end items-center`}>
          <label className="flex items-center pb-2 md:pb-0">
            <span className="text-sm text-default whitespace-no-wrap mr-1">{props.label}</span>
            {tooltip !== '' &&
              <Help>{tooltip}</Help>
            }
          </label>
        </div>
        <div className={`col-md-${props.mdInput} col-xs-12 md:flex items-center`}>
          <p
            className={`
              py-2
              ${typeof props.fontBold !== 'undefined' && props.fontBold ? 'font-bold' : ''}
            `}
          >{props.value}</p>
        </div>
      </div>
    </div>
  );
}

export const InlineBoxSelect: React.FunctionComponent<any> = (props) => {
  const tooltip = typeof props.tooltip !== 'undefined' ? props.tooltip : '';
  const handleOnChange = (v):void => {
    if(typeof props.onChange !== 'undefined') props.onChange(v);
  };

  return (
    <div className={props.className}>
      <div className="row">
        <div className={`col-md-${props.mdLabel} col-xs-12 flex md:justify-end items-center`}>
          <label className="flex items-center pb-2 md:pb-0">
            <span className="text-sm text-default whitespace-no-wrap mr-1">{props.label}</span>
            {tooltip !== '' &&
              <Help>{tooltip}</Help>
            }
          </label>
        </div>
        <div className={`col-md-${props.mdInput} col-xs-12 md:flex items-center`}>
          <div className={`flex`} style={{width: props.fixWidth ? 320 : 'unset'}}>
            {
              typeof props.options !== 'undefined'
                ? props.options.map((el, key) =>
                  <button
                    key={key}
                    className={`
                      btn btn-default btn-indigo ${props.fixWidth ? 'w-full' : ''}
                      ${props.value === el.value ? 'clicked' : ''}
                    `}
                    onClick={() => handleOnChange(el.value)
                  }>
                    {el.label}
                  </button>)
                : ''
            }
          </div>

          {typeof props.error !== 'undefined' && props.error !== '' && (
            <p className="text-xs text-red-500 invalid mt-1 md:ml-4 md:mt-0">{props.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export const InlineReactSelect: React.FunctionComponent<any> = (props) => {
  const tooltip = typeof props.tooltip !== 'undefined' ? props.tooltip : '';

  let placeholder = 'Select..';
  if(typeof props.label !== 'undefined') placeholder = `Select ${props.label.toLowerCase()}`;
  if(typeof props.placeholder !== 'undefined') placeholder = props.placeholder;

  return (
    <div className={props.className}>
      <div className="row">
        <div className={`col-md-${props.mdLabel} col-xs-12 flex md:justify-end items-center`}>
          <label className="flex items-center pb-2 md:pb-0">
            <span className="text-sm text-default whitespace-no-wrap mr-1">{props.label}</span>
            {tooltip !== '' &&
              <Help>{tooltip}</Help>
            }
          </label>
        </div>
        <div className={`col-md-${props.mdInput} col-xs-12 md:flex items-center`}>
          <Select
            instanceId={`react-select-${props.label}-${props.placeholder}`}
            options={props.options}
            value={
              typeof props.isMulti !== 'undefined'
                ? props.options.filter((el) => props.value.includes(el.value))
                : props.options.find((el) => el.value === props.value)
            }
            onChange={(opt) => {
              if(typeof props.onChange !== 'undefined')
                props.onChange(typeof props.isMulti !== 'undefined' ? opt.map((el) => el.value) : opt.value);
            }}
            isMulti={props.isMulti}
            placeholder={placeholder}
            styles={ReactSelectCustomStyles}
            theme={ReactSelectTheme}
            className="block w-full md:w-72 mt-1"
          />

          {typeof props.error !== 'undefined' && props.error !== '' && (
            <p className="text-xs text-red-500 invalid mt-1 md:ml-4 md:mt-0">{props.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export const InlineMYSelect: React.FunctionComponent<any> = (props) => {
  const tooltip = typeof props.tooltip !== 'undefined' ? props.tooltip : '';
  const months = [
    {
      label: 1,
      value: 1
    },
    {
      label: 2,
      value: 2
    },
    {
      label: 3,
      value: 3
    },
    {
      label: 4,
      value: 4
    },
    {
      label: 5,
      value: 5
    },
    {
      label: 6,
      value: 6
    },
    {
      label: 7,
      value: 7
    },
    {
      label: 8,
      value: 8
    },
    {
      label: 9,
      value: 9
    },
    {
      label: 10,
      value: 10
    },
    {
      label: 11,
      value: 11
    },
    {
      label: 12,
      value: 12
    },
  ];
  const years = [
    {
      label: 2020,
      value: 2020
    },
    {
      label: 2021,
      value: 2021
    },
    {
      label: 2022,
      value: 2022
    },
    {
      label: 2023,
      value: 2023
    },
    {
      label: 2024,
      value: 2024
    },
    {
      label: 2025,
      value: 2025
    },
    {
      label: 2026,
      value: 2026
    },
    {
      label: 2027,
      value: 2027
    },
    {
      label: 2028,
      value: 2028
    },
    {
      label: 2029,
      value: 2029
    },
    {
      label: 2030,
      value: 2030
    },
    {
      label: 2031,
      value: 2031
    },
    {
      label: 2032,
      value: 2032
    },
    {
      label: 2033,
      value: 2033
    },
    {
      label: 2034,
      value: 2034
    },
    {
      label: 2035,
      value: 2035
    },
    {
      label: 2036,
      value: 2036
    },
    {
      label: 2037,
      value: 2037
    },
    {
      label: 2038,
      value: 2038
    },
    {
      label: 2039,
      value: 2039
    }
  ];

  const month = props.value.month;
  const year = props.value.year;
  const onChange = typeof props.onChange !== 'undefined' ? props.onChange : () => false;

  const handleChange = (m, y):void => {
    console.log('hanlde changing', m, y);
    onChange({
      month: m,
      year: y
    });
  }

  return (
    <div className={props.className}>
      <div className="row">
        <div className={`col-md-${props.mdLabel} col-xs-12 flex md:justify-end items-center`}>
          <label className="flex items-center pb-2 md:pb-0">
            <span className="text-sm text-default whitespace-no-wrap mr-1">{props.label}</span>
            {tooltip !== '' &&
              <Help>{tooltip}</Help>
            }
          </label>
        </div>
        <div className={`col-md-${props.mdInput} col-xs-12 md:flex items-center`}>
          <Select
            instanceId={`react-select-${props.label}-${props.placeholder}-1`}
            options={months}
            value={months.find((el) => el.value === month)}
            onChange={(opt) => handleChange(opt.value, year)}
            placeholder="Month"
            styles={ReactSelectCustomStyles}
            theme={ReactSelectTheme}
            className="w-24 mr-1"
          />
          <Select
            instanceId={`react-select-${props.label}-${props.placeholder}-1`}
            options={years}
            value={years.find((el) => el.value === year)}
            onChange={(opt) => handleChange(month, opt.value)}
            placeholder="Year"
            styles={ReactSelectCustomStyles}
            theme={ReactSelectTheme}
            className="w-24"
          />
          {typeof props.error !== 'undefined' && props.error !== '' && (
            <p className="text-xs text-red-500 invalid mt-1 md:ml-4 md:mt-0">{props.error}</p>
          )}
        </div>
      </div>
    </div>
  );
}

const ReactSelectCustomStyles = {
  menu: (provided) => ({
    ...provided,
    margin: 0,
    borderRadius: 0
  }),
  control: (provided) => ({
    ...provided,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 0,
    boxShadow: 'unset'
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '4px 9px'
  })
}

const ReactSelectTheme = (theme: any):any => ({
  ...theme,

  colors: {
    ...theme.colors,
    primary: getColor('bg-indigo-500'),
    primary25: toRGB(getColor('bg-indigo-500'), 0.25),
    primary50: toRGB(getColor('bg-indigo-500'), 0.5),
    primary75: toRGB(getColor('bg-indigo-500'), 0.75),
    danger: getColor('bg-red-500'),
    dangerLight: toRGB(getColor('bg-red-500'), 0.25),
  },
});