import React from 'react';
import ReactDatePicker from "react-datepicker";

const DateTimePicker: React.FunctionComponent<any> = ({
  value = null,
  onChange = () => false,
  label = ''
}) => (
    <div className="datepicker-wrapper">
      <ReactDatePicker
        selected={value}
        onChange={(dateTime) => onChange(dateTime)}
        timeInputLabel={label}
        dateFormat="MM/dd/yyyy h:mm aa"
        showTimeInput
        className="form-input border-underline text-sm w-57"
      />
    </div>
  )

export default DateTimePicker;