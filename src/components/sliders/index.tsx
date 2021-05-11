import React, { useState } from 'react';
import Slider, { Range } from 'rc-slider';
import { random } from 'functions/numbers';

export const DefaultSlider: React.FunctionComponent<any> = ({
  className = 'slider-blue',
}: any) => {
  const [value, onChange] = useState(random(30, 70));

  return (
    // @ts-ignore
    <Slider
      className={className}
      onChange={onChange}
      min={0}
      max={100}
      defaultValue={value}
    />
  );
};

export const RangeSlider: React.FunctionComponent<any> = ({
  className = 'slider-blue',
}) => {
  const [value, onChange] = useState([random(10, 30), random(60, 90)]);

  return (
    // @ts-ignore
    <Range
      className={className}
      allowCross={false}
      defaultValue={value}
      onChange={onChange}
      min={0}
      max={100}
    />
  );
};
