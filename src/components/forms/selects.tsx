import React, { useState, useEffect } from 'react';
import RSelect  from 'react-select';
import ClickOutside from 'react-click-outside';

import { getColor, toRGB } from 'functions/colors';

export const Select: React.FunctionComponent<any> = (props) => {
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
  useEffect(() => {
    if(typeof props.onChange !== 'undefined')
      props.onChange(selectedOption.value);
  }, [ selectedOption ]);

  return (
    <ClickOutside onClickOutside={() => {
      setIsOpen(false);
      setIsFocus(false);
    }}>
      <div
        className={`
          common-select-dropdown-wrapper
          ${isFocus ? 'focus' : ''}
          ${typeof props.className !== 'undefined' ? props.className : ''}
          ${typeof props.size !== 'undefined' ? `size-${props.size}` : ''}
        `}
      >
        { typeof props.label !== 'undefined' &&
          <label className="inline-flex items-center children-x-2">
            <span className="text-sm text-default whitespace-no-wrap">{props.label}</span>
          </label>
        }
        <div className="common-select-dropdown-control flex justify-between text-sm block border w-full md:w-64"
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
                  M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747
                  3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445
                  0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217
                  0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0
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

        {typeof props.error !== 'undefined' &&
          <p className="text-xs text-red-500 invalid">{props.error}</p>
        }
      </div>
    </ClickOutside>
  );
};

export const BoxSelect: React.FunctionComponent<any> = (props) => {
  const handleOnChange = (v):void => {
    if(typeof props.onChange !== 'undefined') props.onChange(v);
  };

  return (
    <div
      className={`
        flex flex-row items-center justify-start
        ${typeof props.className !== 'undefined' ? props.className : ''}
      `}
    >
      <label className="inline-flex items-center children-x-2">
        <span className="text-sm text-default whitespace-no-wrap">{props.label}</span>
      </label>
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
                    onClick={() => handleOnChange(el.value)}>
                      {el.label}
                  </button>
                )
              : ''
          }
        </div>
      </div>

      {typeof props.error !== 'undefined' &&
        <p className="text-xs text-red-500 invalid">{props.error}</p>
      }
    </div>
  );
}

export const CheckSelect: React.FunctionComponent<any> = (props) => {
  const [ isOpen, setIsOpen ] = useState(false);
  const [ checks, setChecks ] = useState(props.value);

  useEffect(() => {
    if(typeof props.onChange !== 'undefined') props.onChange(checks);
  }, [ checks ]);

  return(
    <ClickOutside onClickOutside={() => setIsOpen(false)}>
      <div className="box-select-dropdown-wrapper">
        <button
          className={`btn btn-default btn-indigo ${isOpen ? 'clicked' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {props.placeholder}
          <i className="icon-arrow-down ml-1"></i>
        </button>
        {isOpen &&
            <div className="box-select-dropdown">
              {
                props.options.map((el, key) => (
                  <div key={key} className="box-select-dropdown-item">
                    <label className="inline-flex items-center children-x-2">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4"
                        checked={checks.indexOf(el.value) !== -1 ? true : false}
                        onChange={
                          (e) => e.target.checked
                            ? setChecks((prev) => [ ...prev, el.value])
                            : setChecks(checks.filter((c) => c!== el.value))
                        }
                      />
                      <span>{el.label}</span>
                    </label>
                  </div>
                ))
              }
            </div>
        }
      </div>
    </ClickOutside>
  );
}

export const ReactSelect: React.FunctionComponent<any> = (props) => {
  let customStyles;

  customStyles = {
    menu: (provided) => ({
      ...provided,
      margin: 0,
      borderRadius: 0,
    }),
    control: (provided) => ({
      ...provided,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderRadius: 0,
      boxShadow: 'unset',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '4px 9px'
    })
  }

  if(props.size === 'sm'){
    customStyles = {
      menu: (provided) => ({
        ...provided,
        margin: 0,
        borderRadius: 0,
      }),
      control: (provided) => ({
        ...provided,
        minHeight: 34,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderRadius: 0,
        boxShadow: 'unset',
      }),
      container: (provided) => ({
        ...provided,
        height: 34,
      }),
      option: (provided) => ({
        ...provided,
        padding: '6.5px 12px',
      }),
      valueContainer: (provided) => ({
        ...provided,
        padding: '1.5px 8px'
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        padding: '6px 8px'
      }),
    }
  }

  return (
    <RSelect
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
      placeholder={ typeof props.placeholder !== 'undefined' ? props.placeholder : 'Select..' }
      styles={customStyles}
      theme={(theme: any) => ({
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
      })}
      className={typeof props.className !== 'undefined' ? props.className : ''}
    />
  );
}
