import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import SectionTitle from '../section-title';

export const Intro: React.FunctionComponent<any> = () => {
  const { name } = useSelector(
    (state: any) => ({
      name: state.global.name,
    }),
    shallowEqual
  );

  return (
    <div className="mb-8">
      <SectionTitle
        title="Installation instructions"
        subtitle={`${name} installation instructions`}
      />

      <p className="mb-2">
        <span className="font-bold">{name}</span> is an advanced, responsive
        admin template built with{' '}
        <a
          className="link"
          href="https://facebook.github.io/react"
          target="_blank"
          rel="noopener noreferrer"
        >
          React
        </a>
        ,{' '}
        <a
          className="link"
          href="https://redux.js.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Redux
        </a>
        ,{' '}
        <a
          className="link"
          href="https://nextjs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.js
        </a>{' '}
        and{' '}
        <a
          className="link"
          href="https://tailwindcss.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tailwind CSS
        </a>
        .
      </p>

      <p className="mb-8">
        It includes 4 different layouts, 2 background, 4 navbar, top navigation
        and left sidebar color styles, 100+ components in every layout and lots
        of widgets and custom made reusable components to help you kickstart
        your next React project or application.
      </p>
    </div>
  );
};

export const Instructions: React.FunctionComponent<any> = () => {
  const { name } = useSelector(
    (state: any) => ({
      name: state.global.name,
    }),
    shallowEqual
  );

  return (
    <div className="mb-8">
      <p className="mb-8">
        To install, first make sure <code>node</code>, <code>npm</code> and{' '}
        <code>yarn</code> are installed in your system. If they are not
        installed, you can get <code>node</code> and <code>npm</code>{' '}
        <a
          className="link"
          href="https://nodejs.org/en/"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>{' '}
        and <code>yarn</code>{' '}
        <a
          className="link"
          href="https://classic.yarnpkg.com/en/"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>

      <p className="mb-2">
        To check if they are installed correctly, run the following commands,
        which should print at least the following versions.
      </p>

      <ol className="list-decimal pl-4 mb-8">
        <li className="mb-2">
          <code>node -v</code> v10.16.1
        </li>

        <li className="mb-2">
          <code>npm -v</code> 6.14.3
        </li>

        <li className="mb-2">
          <code>yarn -v</code> 1.22.4
        </li>
      </ol>

      <p className="mb-2">
        <span className="font-bold">{name}</span> is 100% ready to use. Just
        unzip the included files and run the following commands:{' '}
      </p>

      <ol className="list-decimal pl-4 mb-8">
        <li className="mb-2">
          <code>npm install</code> or <code>yarn install</code> to install all
          the required dependencies
        </li>

        <li className="mb-2">
          <code>npm run dev</code> to run the development server
        </li>

        <li className="mb-2">
          Open <code>http://localhost:3333</code>
        </li>
      </ol>

      <p className="mb-2">
        To build and run a production ready bundle, run the following commands:{' '}
      </p>

      <ol className="list-decimal pl-4 mb-8">
        <li className="mb-2">
          <code>npm run build</code>
        </li>

        <li className="mb-2">
          <code>npm run start</code>
        </li>

        <li className="mb-2">
          Open <code>http://localhost:4444</code>
        </li>
      </ol>
    </div>
  );
};

export const TemplateStructure: React.FunctionComponent<any> = () => (
  <div className="mb-8">
    <SectionTitle
      title="Template structure"
      subtitle="Structural elements available in the template"
    />

    <p className="mb-2">
      The template includes the following structural elements:
    </p>

    <ol className="list-disc pl-6 mb-2">
      <li className="mb-2">Navbar</li>

      <li className="mb-2">Top navigation</li>

      <li className="mb-2">Left sidebar</li>

      <li className="mb-2">Right sidebar</li>

      <li className="mb-2">Main content section</li>
    </ol>
  </div>
);
