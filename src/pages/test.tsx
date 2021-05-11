import React from 'react';
import * as Icon from 'react-feather';
import Layout from 'layouts';

import SectionTitle from 'components/section-title';
import {Button} from 'components/buttons';

const Index: React.FunctionComponent<any> = () => (
  <Layout>
    <SectionTitle title="Pages" subtitle="Empty page" />
    <p>Pure buttons</p><br/>
    <div>

      <button className="btn btn-default btn-indigo w-32 mr-4">CREATE</button>
      <p>&nbsp;</p>
      <button className="btn btn-flat btn-icon mx-1">
        <i className="icon-note" />
      </button>
      <br/>
      <button className="btn btn-sm btn-outlined btn-outlined-indigo">
        <div className="flex items-center">
          <Icon.Plus size={14} className="mr-1" />
          CREATE BUYER
        </div>
      </button>

      <p>&nbsp;</p>
      <button
        className="btn btn-flat btn-icon mx-1"
      >
        <i className="icon-arrow-right-circle" />
      </button>
      <br/>
      <button
        className="btn btn-default btn-flat btn-flat-indigo mr-4"
      >
        Back
      </button>
      <br></br>
      <Button
        className="w-48"
        loading={true}
      >
        LOADING
      </Button>
    </div>
    <br />
    <p>Component buttons</p><br/>
    <div>

      <Button
        className="w-32 mr-4"
      >
        CREATE
      </Button>
      <br/>
      <br/>

      <Button
        outlined
        size="sm"
        leftIcon="Plus"
        rightIcon="Minus"
      >
        CREATE BUYER
      </Button>
      <br/>
      <br/>
      <Button
        flat
      >
        BACK
      </Button>
      <br/>
      <br/>
      <Button
        flat
        icon
        leftIcon="Edit"
      />
      <br/>
      <br/>
      <Button
        color="red"
        outlined
        className="w-48"
        loading
      >
        LOAD
      </Button>
    </div>
  </Layout>
);
export default Index;
