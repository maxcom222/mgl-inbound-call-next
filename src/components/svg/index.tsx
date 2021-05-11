import React from 'react';

export const Cross: React.FunctionComponent<any> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="form-icon form-success"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>

    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const Check: React.FunctionComponent<any> = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="form-icon form-error"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
