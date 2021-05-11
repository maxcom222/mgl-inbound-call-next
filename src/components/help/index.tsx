import React from 'react';
import * as Icon from 'react-feather';
import { Tooltip } from 'react-tippy';

const Index: React.FunctionComponent<any> = (props) => (
    <Tooltip
      title={props.children}
      position="right"
      arrow={true}
      duration={0}
      hideDuration={0}
    >
      <Icon.HelpCircle size={13} />
    </Tooltip>
  )

export default Index;