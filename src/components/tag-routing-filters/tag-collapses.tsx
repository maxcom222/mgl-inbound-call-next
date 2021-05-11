import React from 'react';
import * as Icon from 'react-feather';

import {Collapse} from '../collapse';

const Index: React.FunctionComponent<any> = (props) => {
  const options = props.options;

  return(
    <div>
      {options.map((el, key) => (
        <Collapse
          label={el.label}
          key={key}
        >
          {el.items.map((ell, keyy) => (
            <a
              key={keyy}
              className="block mb-2 cursor-pointer flex items-center"
              onClick={() => typeof props.onChange !== 'undefined' ? props.onChange(ell.value) : false}
            >
              <Icon.Tag
                size={14}
              />
              <span className="ml-2">{ell.label}</span>
            </a>
          ))}
        </Collapse>
      ))}
    </div>
  );
}

export default Index;