import React from 'react';
import { mount } from 'cypress-react-unit-test';
import { ErrorMessage } from '@app/shared/components/General/Form/Message';

describe('HelloWorld component', () => {
  it('works', () => {
    mount(<ErrorMessage message="Hello World!" />);
    // now use standard Cypress commands
    cy.contains('Hello World!').should('be.visible');
  });
});
