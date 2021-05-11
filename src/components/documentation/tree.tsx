/* eslint-disable no-irregular-whitespace */
import React from 'react';

import SectionTitle from '../section-title';
export const Tree: React.FunctionComponent<any> = () => (
  <>
    value, but is being use... Remove this comment to see the full error message
    <SectionTitle title="Folder tree" subtitle="All folders" />
    <div className="flex">
      <div className="w-full">
        <pre>{`├── public
│   ├── assets
│   │   └── faces
│   ├── images
│   │   └── products
│   ├── logos
│   └── screenshots
└── src
    ├── components
    │   ├── alerts
    │   ├── badges
    │   ├── breadcrumbs
    │   ├── buttons
    │   ├── charts
    │   ├── contact-us-1
    │   ├── create-account-1
    │   ├── dashboard-1
    │   ├── dashboard-2
    │   ├── datatable
    │   ├── datepicker
    │   ├── documentation
    │   ├── dropdown-widgets
    │   ├── flag
    │   ├── forgot-password-1
    │   ├── form-validation
    │   ├── icon
    │   ├── landing
    │   ├── leaflet-maps
    │   ├── left-sidebar-1
    │   ├── left-sidebar-2
    │   ├── lock-screen-1
    │   ├── login-1
    │   ├── login-2
    │   ├── login-3
    │   ├── modals
    │   ├── navbar-1
    │   ├── notifications
    │   ├── pagination
    │   ├── popovers
    │   ├── profile
    │   ├── progress-bars
    │   ├── reset-password-1
    │   ├── right-sidebar-1
    │   ├── section-title
    │   ├── sliders
    │   ├── subscribe-1
    │   ├── svg
    │   ├── switch
    │   ├── table-widgets
    │   ├── tabs
    │   ├── tooltips
    │   ├── top-navigation-1
    │   ├── ui-elements
    │   ├── vector-maps
    │   ├── widget
    │   └── widget-title
    ├── scss
    │   ├── components
    │   ├── fonts
    │   ├── layouts
    │   └── palettes
    ├── functions
    ├── json
    ├── layouts
    │   ├── centered
    │   ├── empty
    │   ├── layout-1
    │   ├── layout-2
    │   ├── layout-3
    │   ├── layout-4
    ├── lib
    ├── navigation
    └── pages
        ├── charts
        ├── dashboards
        ├── demos
        ├── documentation
        ├── extras
        ├── forms
        ├── icons
        ├── landing
        ├── maps
        ├── notifications
        ├── pages
        ├── tables
        └── ui-elements

`}</pre>
      </div>
    </div>
  </>
);
