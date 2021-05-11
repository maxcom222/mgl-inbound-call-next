import React from 'react';
import Centered from 'layouts/centered';

import Form from 'components/create-account-1';

const Signup: React.FunctionComponent<any> = () => (
  <Centered>
    <p className="text-secondary mb-4">
      Please enter your name, email address and password to create an account
    </p>
    <Form />
  </Centered>
);

export default Signup;
