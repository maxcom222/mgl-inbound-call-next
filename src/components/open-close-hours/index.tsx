import React, {useState} from 'react';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import * as Icon from 'react-feather';
import { Tooltip } from 'react-tippy';

import Switch from '../switch';

const OpenCloseHours: React.FunctionComponent<any> = (props) => {
  const vips = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const initialValues = {
    data: [
      {
        openTime: {
          data: {
            minute: 0,
            hour: 9
          }
        },
        closeTime: {
          data: {
            minute: 0,
            hour: 21
          }
        },
        inverted: false,
        isClosed: false
      },
      {
        openTime: {
          data: {
            minute: 0,
            hour: 9
          }
        },
        closeTime: {
          data: {
            minute: 0,
            hour: 21
          }
        },
        inverted: false,
        isClosed: false
      },
      {
        openTime: {
          data: {
            minute: 0,
            hour: 9
          }
        },
        closeTime: {
          data: {
            minute: 0,
            hour: 21
          }
        },
        inverted: false,
        isClosed: false
      },
      {
        openTime: {
          data: {
            minute: 0,
            hour: 9
          }
        },
        closeTime: {
          data: {
            minute: 0,
            hour: 21
          }
        },
        inverted: false,
        isClosed: false
      },
      {
        openTime: {
          data: {
            minute: 0,
            hour: 9
          }
        },
        closeTime: {
          data: {
            minute: 0,
            hour: 21
          }
        },
        inverted: false,
        isClosed: false
      },
      {
        openTime: {
          data: {
            minute: 0,
            hour: 9
          }
        },
        closeTime: {
          data: {
            minute: 0,
            hour: 21
          }
        },
        inverted: false,
        isClosed: false
      },
      {
        openTime: {
          data: {
            minute: 0,
            hour: 9
          }
        },
        closeTime: {
          data: {
            minute: 0,
            hour: 21
          }
        },
        inverted: false,
        isClosed: false
      }
    ]
  }

  const hours = props.value;

  const [advanced, setAdvanced] = useState(
    typeof props.value !== 'undefined'
      ? !props.value.data.every((el) =>
          props.value.data[0].openTime.data.hour === el.openTime.data.hour &&
          props.value.data[0].openTime.data.minute === el.openTime.data.minute &&
          props.value.data[0].closeTime.data.hour === el.closeTime.data.hour &&
          props.value.data[0].closeTime.data.minute === el.closeTime.data.minute
        )
      : false
  );

  const disabledOpenTime = (index):any => {
    const openTime = hours.data[index].openTime.data;
    const closeTime = hours.data[index].closeTime.data;
    const disabledOpenTimeValue: {hours: number[]; minutes: number[]} = {
      hours: [],
      minutes: []
    };

    Array(24 - closeTime.hour - 1).fill(null).map((_, key) => {
      disabledOpenTimeValue.hours.push(Number(closeTime.hour) + 1 + key);
    });

    if(openTime.hour === closeTime.hour){
      Array(60 - closeTime.minute - 1).fill(null).map((_, key) => {
        disabledOpenTimeValue.minutes.push(Number(closeTime.minute) + 1 + key);
      });
    }

    return disabledOpenTimeValue;
  }
  const disabledCloseTime = (index):any => {
    const openTime = hours.data[index].openTime.data;
    const closeTime = hours.data[index].closeTime.data;
    const disabledCloseTimeValue: {hours: number[]; minutes: number[]} = {
      hours: [],
      minutes: []
    };

    Array(openTime.hour).fill(null).map((_, key) => {
      disabledCloseTimeValue.hours.push(key);
    });

    if(openTime.hour === closeTime.hour){
      Array(openTime.minute).fill(null).map((_, key) => {
        disabledCloseTimeValue.minutes.push(key);
      });
    }

    return disabledCloseTimeValue;
  }
  const label = typeof props.label !== 'undefined' ? props.label : '';
  const tooltip = typeof props.tooltip !== 'undefined' ? props.tooltip : '';

  return(
    <div className={props.className}>
      <div className="row">
        <div className="col-md-3 col-xs-12 flex md:justify-end items-center">
          <label className="flex items-center pb-2 md:pb-0">
            <span className="text-sm text-default whitespace-no-wrap mr-1">{label}</span>
            {tooltip !== '' &&
              <Tooltip
                title={tooltip}
                position="right"
                arrow={true}
                duration={0}
                hideDuration={0}
              >
                <Icon.HelpCircle size={13} />
              </Tooltip>
            }
          </label>
        </div>
        <div className="col-md-3 col-xs-6">
          <Switch
            checked={hours.data.length > 0}
            onChange={(checked) => {
              props.onChange(
                checked ? initialValues : {data: []}
              )
            }}
          />
        </div>
        <div className="col-md-3 col-xs-6">
          {
            hours.data.length > 0
              ? (
                <button
                  className="btn btn-sm btn-outlined btn-outlined-green"
                  onClick={() => {
                    setAdvanced(!advanced);
                    props.onChange(initialValues);
                  }}
                >
                  &nbsp;{advanced ? 'BASIC' : 'ADVANCED'}&nbsp;
                </button>
              )
              : (
                <p>Always Open</p>
              )
          }
        </div>
      </div>
      {hours.data.length > 0 &&
        <div className="row mt-3">
          <div className="col-md-9 col-md-offset-3 col-xs-12 overflow-x-auto">
            <table className="table table-xlg-body outline no-border striped header-gray" style={{minWidth: 'unset'}}>
              {
                advanced
                  ? (
                    <>
                      <thead>
                        <tr>
                          <th>&nbsp;</th>
                          <th>Open</th>
                          <th>Open Time</th>
                          <th>Close Time</th>
                          <th>Breaks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hours.data.map((el, key) => (
                          <tr key={key}>
                            <td>{vips[key]}</td>
                            <td>
                              <Switch
                                checked={!el.isClosed}
                                onChange={(checked) => {
                                  const newHours = {...hours}
                                  newHours.data[key].isClosed = !checked;
                                  props.onChange(newHours);
                                }}
                              />
                            </td>
                            <td>
                              <TimePicker
                                value={moment({hour: el.openTime.data.hour, minute: el.openTime.data.minute})}
                                onChange={(value) => {
                                  let newHour =  value.hour();
                                  let newMinute = value.minute();
                                  const newHours = {...hours}
                                  const closeTime = hours.data[key].closeTime.data;

                                  if(value.hour() > closeTime.hour){
                                    newHour = closeTime.hour;
                                  }

                                  if(value.hour() >= closeTime.hour && value.minute() > closeTime.minute){
                                    newMinute = closeTime.minute;
                                  }

                                  newHours.data[key].openTime.data.hour = newHour;
                                  newHours.data[key].openTime.data.minute = newMinute;

                                  props.onChange(newHours);
                                }}
                                disabledHours={() => disabledOpenTime(key).hours}
                                disabledMinutes={() => disabledOpenTime(key).minutes}
                                showSecond={false}
                                format="h:mm a"
                                allowEmpty={false}
                                use12Hours
                                inputReadOnly
                              />
                            </td>
                            <td>
                              <TimePicker
                                value={moment({hour: el.closeTime.data.hour, minute: el.closeTime.data.minute})}
                                onChange={(value) => {
                                  let newHour =  value.hour();
                                  let newMinute = value.minute();
                                  const newHours = {...hours}
                                  const openTime = hours.data[key].openTime.data;

                                  if(value.hour() < openTime.hour){
                                    newHour = openTime.hour;
                                  }

                                  if(value.hour() <= openTime.hour && value.minute() < openTime.minute){
                                    newMinute = openTime.minute;
                                  }

                                  newHours.data[key].closeTime.data.hour = newHour;
                                  newHours.data[key].closeTime.data.minute = newMinute;

                                  props.onChange(newHours);
                                }}
                                disabledHours={() => disabledCloseTime(key).hours}
                                disabledMinutes={() => disabledCloseTime(key).minutes}
                                showSecond={false}
                                format="h:mm a"
                                allowEmpty={false}
                                use12Hours
                                inputReadOnly
                              />
                            </td>
                            <td>
                              <button className="btn btn-xs btn-yellow">Add New Break</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  )
                  : (
                    <>
                      <thead>
                        <tr>
                          <th>&nbsp;</th>
                          <th>Open Time</th>
                          <th>Close Time</th>
                          <th>Breaks</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Monday - Sunday</td>
                          <td>
                            <TimePicker
                              value={
                                moment({
                                  hour: hours.data[0].openTime.data.hour,
                                  minute: hours.data[0].openTime.data.minute
                                })
                              }
                              onChange={(value) => {
                                let newHour =  value.hour();
                                let newMinute = value.minute();
                                const newHours = {...hours}
                                const closeTime = hours.data[0].closeTime.data;

                                if(value.hour() > closeTime.hour){
                                  newHour = closeTime.hour;
                                }

                                if(value.hour() >= closeTime.hour && value.minute() > closeTime.minute){
                                  newMinute = closeTime.minute;
                                }

                                newHours.data.forEach((el) => {
                                  el.openTime.data.hour = newHour;
                                  el.openTime.data.minute = newMinute;
                                });

                                props.onChange(newHours);
                              }}
                              disabledHours={() => disabledOpenTime(0).hours}
                              disabledMinutes={() => disabledOpenTime(0).minutes}
                              showSecond={false}
                              format="h:mm a"
                              allowEmpty={false}
                              use12Hours
                              inputReadOnly
                            />
                          </td>
                          <td>
                            <TimePicker
                              value={
                                moment({
                                  hour: hours.data[0].closeTime.data.hour,
                                  minute: hours.data[0].closeTime.data.minute
                                })
                              }
                              onChange={(value) => {
                                let newHour =  value.hour();
                                let newMinute = value.minute();
                                const newHours = {...hours}
                                const openTime = hours.data[0].openTime.data;

                                if(value.hour() < openTime.hour){
                                  newHour = openTime.hour;
                                }

                                if(value.hour() <= openTime.hour && value.minute() < openTime.minute){
                                  newMinute = openTime.minute;
                                }

                                newHours.data.forEach((el) => {
                                  el.closeTime.data.hour = newHour;
                                  el.closeTime.data.minute = newMinute;
                                });
                                props.onChange(newHours);
                              }}
                              disabledHours={() => disabledCloseTime(0).hours}
                              disabledMinutes={() => disabledCloseTime(0).minutes}
                              showSecond={false}
                              format="h:mm a"
                              allowEmpty={false}
                              use12Hours
                              inputReadOnly
                            />
                          </td>
                          <td>
                            <button className="btn btn-xs btn-yellow">Add New Break</button>
                          </td>
                        </tr>
                      </tbody>
                    </>
                  )
              }
            </table>
          </div>
        </div>
      }
    </div>
  );
}

export default OpenCloseHours;