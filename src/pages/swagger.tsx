import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const Index: React.FunctionComponent<any> = () => (
  <SwaggerUI url="/assets/swagger.json" />
);
export default Index;
