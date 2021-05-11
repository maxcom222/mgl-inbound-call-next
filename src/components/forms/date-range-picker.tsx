import React, { useState, useEffect } from 'react';
import ClickOutside from 'react-click-outside';
import ReactDatePicker from "react-datepicker";
import moment from 'moment';

const options=[
  {
    label: 'Today',
    value: 'today'
  },
  {
    label: 'Yesterday',
    value: 'yerterday'
  },
  {
    label: 'Last 2 Days',
    value: 'last 2 days'
  },
  {
    label: 'Last 7 Days',
    value: 'last 7 days'
  },
  {
    label: 'Last Week',
    value: 'last week'
  },
  {
    label: 'Last 30 Days',
    value: 'last 30 days'
  },
  {
    label: 'This Month',
    value: 'this month'
  },
  {
    label: 'Last Month',
    value: 'last month'
  },
  {
    label: 'This Year',
    value: 'this year'
  },
];

const DateRangePicker: React.FunctionComponent<any> = (props) => {
  let initialSelectedOption = {
    label: '',
    value: ''
  };
  if(typeof props.value !== 'undefined' && options.findIndex((el) => el.value === props.value) !== -1){
    initialSelectedOption = options[options.findIndex((el) => el.value === props.value)];
  }
  const [ selectedOption, setSelectedOption ] = useState(initialSelectedOption);
  const [ isOpen, setIsOpen ] = useState(false);
  const [ isFocus, setIsFocus ] = useState(false);
  const [ startDate, setStartDate ] = useState(new Date());
  const [ endDate, setEndDate ] = useState(null);
  const handleDatesChange = (dates):void => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  }
  useEffect(() => {
    if(typeof props.onChange !== 'undefined') props.onChange(selectedOption.value);
  }, [ selectedOption ]);
  useEffect(() => {
    if(endDate !== null){
      setSelectedOption({
        label: `${moment(startDate).format('MMM DD, YYYY')} - ${moment(endDate).format('MMM DD, YYYY')}`,
        value: 'custom range'
      });
      setIsOpen(false);
    }
  }, [ endDate ]);

  return (
    <ClickOutside onClickOutside={() => {
      setIsOpen(false);
      setIsFocus(false);
    }}>
      <div
        className={`
          datepicker-wrapper
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
        <div className="datepicker-control flex justify-between text-sm block border w-full md:w-64"
          onClick={() => {
            setIsOpen(!isOpen);
            setIsFocus(true);
          }}
        >
          <div className={`datepicker-text ${selectedOption.value !== '' ? 'active' : ''}`}>
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
          <div className="datepicker-indicator-wrapper">
            <svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
              <path
                d="
                  M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446
                  1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502
                  0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z
                "
              ></path>
            </svg>
          </div>
        </div>
        {isOpen &&
          <div className="datepicker-dropdown">
            {
              options.map((el, key) => (
                <div
                  key={key}
                  className={`
                    datepicker-item
                    ${(selectedOption !== null && selectedOption.value === el.value) ? 'active' : ''}
                  `}
                  onClick={() => {
                  setSelectedOption(el);
                  setStartDate(new Date());
                  setEndDate(null);
                  setIsOpen(false);
                }}>
                  {el.label}
                </div>
              ))
            }

            <div
              className={`
                datepicker-item
                ${(selectedOption !== null && selectedOption.value === 'custom range') ? 'active' : ''}
              `}
              onClick={() => setSelectedOption({label: 'Custom Range', value: 'custom range'})}
            >
              Custom Range
            </div>
            { selectedOption.value === 'custom range' &&
              <div className="datepicker-range-container">
                <div className="datepicker-range-wrapper">
                  <ReactDatePicker
                    selected={startDate}
                    onChange={(dates) => handleDatesChange(dates)}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    disabledKeyboardNavigation
                  />
                </div>
              </div>
            }
          </div>
        }

        {typeof props.error !== 'undefined' &&
          <p className="text-xs text-red-500 invalid">{props.error}</p>
        }
      </div>
    </ClickOutside>
  );
}

export default DateRangePicker;