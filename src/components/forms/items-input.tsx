import React, {useState} from 'react';
import * as Icon from 'react-feather';
import { Tooltip } from 'react-tippy';

import { Button } from 'components/buttons';
import ClickOutside from 'react-click-outside';

const ItemsInput: React.FunctionComponent<any> = ({
  className = '',
  mdLabel = '12',
  mdInput = '12',
  btnLabel = 'ADD',

  label = '',
  tooltip = 'Specify Tag Filters to give payout only if the call satisfies the filters.',
  placeholderName = '',
  placeholderValue = '',
  error = '',
  value = [],
  onChange = () => false
}: Props) => {
  const [item, setItem] = useState({
    name: '',
    value: ''
  });
  const [focus, setFocus] = useState(false);

  return (
    <div className={className}>
      <div className="row">
        <div className={`col-md-${mdLabel} col-xs-12 flex md:justify-end items-center`}>
          <div className="flex items-center">
            <span className="mr-1">{label}</span>
            <Tooltip
              title={tooltip}
              position="right"
              arrow={true}
              duration={0}
              hideDuration={0}
            >
              <Icon.HelpCircle size={13} />
            </Tooltip>
          </div>
        </div>
        <div className={`col-md-${mdInput} col-xs-12`}>
          <div className="md:flex items-center">
            <ClickOutside onClickOutside={() => {
              setFocus(false);
            }}>
              <div className={`items-input ${focus ? 'active' : ''} flex px-3 py-1`}>
                <input
                  className="text-sm w-24 bg-transparent focus:outline-none"
                  placeholder={placeholderName}
                  value={item.name}
                  onFocus={() => setFocus(true)}
                  onChange={(e) => setItem({...item, name: e.target.value})}
                />
                <span onClick={() => setFocus(true)}>:&nbsp;</span>
                <input
                  className="text-sm w-24 bg-transparent focus:outline-none"
                  placeholder={placeholderValue}
                  value={item.value}
                  onFocus={() => setFocus(true)}
                  onChange={(e) => setItem({...item, value: e.target.value})}
                />
              </div>
            </ClickOutside>
            <Button
              outlined
              color="green"
              size="sm"
              className="ml-2"
              onClick={() => {
                const newValue = [...value];
                newValue.push(item);
                onChange(newValue);
                setItem({
                  name: '',
                  value: ''
                });
              }}
              disabled={(item.name !== '' && item.value !== '') ? false : true }
            >
              {btnLabel}
            </Button>

            {typeof error !== 'undefined' && error !== '' && (
              <p className="text-xs text-red-500 invalid mt-1 md:ml-4 md:mt-0">{error}</p>
            )}
          </div>
        </div>
      </div>
      <div className="row mt-2">
        <div className={`col-md-${mdLabel} col-xs-12`}></div>
        <div className={`col-md-${mdInput} col-xs-12`}>
          <div className="flex">
            {value.map((el, key) => (
              <div key={key} className="flex items-centerpx-1 pl-1 mr-2 text-xs bg-gray-400">
                <span className="mr-1">
                  {el.name}: {el.value}
                </span>
                <Button
                  flat
                  icon
                  size="xs"
                  leftIcon="X"
                  onClick={() => {
                    const newValue = [...value];
                    newValue.splice(key, 1);
                    onChange(newValue)
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  readonly className?: string;
  readonly mdLabel?: string;
  readonly mdInput?: string;
  readonly label?: string;
  readonly placeholderName?: string;
  readonly placeholderValue?: string;
  readonly error?: string;
  readonly value?: any;
  readonly onChange?: any;
  readonly btnLabel?: string;
  readonly tooltip?: string;
};

export default ItemsInput;