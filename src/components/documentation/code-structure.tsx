/* eslint-disable max-len */
import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import SectionTitle from '../section-title';

export const CodeStructure: React.FunctionComponent<any> = () => {
  const { name } = useSelector(
    (state: any) => ({
      name: state.global.name,
    }),
    shallowEqual
  );

  return (
    <div className="mb-8">
      <SectionTitle
        title="Code structure"
        subtitle="File and folder code structure"
      />

      <p className="mb-2">
        <span className="font-bold">{name}</span> uses the default{' '}
        <a
          className="link"
          href="https://nextjs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.js
        </a>{' '}
        file and folder code structure. For more information on the project and
        to familiarize yourself with the file and folder structure used in{' '}
        <a
          className="link"
          href="https://nextjs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.js
        </a>
        , please go to the{' '}
        <a
          className="link"
          href="https://nextjs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Next.js
        </a>{' '}
        website.
      </p>
    </div>
  );
};

export const NamingConventions: React.FunctionComponent<any> = () => (
  <div className="mb-8">
    <SectionTitle
      title="Naming conventions"
      subtitle="File and folder definitions and naming conventions used in the template"
    />

    <p className="mb-2">
      Every page included in the template follows the{' '}
      <a
        className="link"
        href="https://nextjs.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Next.js
      </a>{' '}
      routing convention. All pages are located in the <code>src/pages</code>{' '}
      folder.
    </p>

    <p className="mb-2">
      All components and widgets are located in the
      <code>src/components</code> folder.
    </p>

    <p className="mb-2">
      All layouts and structural views are located in the
      <code>src/layouts</code> folder.
    </p>

    <p className="mb-2">
      SCSS files are located in the
      <code>src/scss</code> folder.
    </p>

    <p className="mb-2">
      All color palettes are located in the
      <code>src/scss/palettes</code> folder.
    </p>
  </div>
);

export const Folders: React.FunctionComponent<any> = () => {
  const items = [
    {
      folder: 'src/components',
      description:
        'Includes all the components ands widgets included in the template',
    },
    { folder: 'src/scss', description: 'Includes SCSS files' },
    {
      folder: 'src/layouts',
      description: 'Includes all layouts and structural views',
    },
    {
      folder: 'src/scss/palettes',
      description:
        'Includes all the color and palette definitions for backgrounds, left sidebars, logos, navbars, right sidebar and top navigation components',
    },
    {
      folder: 'src/scss/layouts',
      description: 'Includes SCSS for all the included layouts',
    },
    {
      folder: 'src/scss/components',
      description: 'Includes SCSS for all the included components',
    },
    {
      folder: 'src/functions',
      description: 'Includes helpers and functions used in the template',
    },
    {
      folder: 'src/json',
      description:
        'Includes sample json files with data used in some views and components',
    },
    {
      folder: 'src/navigation',
      description:
        'Includes menus and navigation files that are used in the left sidebar and top navigation components',
    },
    { folder: 'src/pages', description: 'Includes all pages and sample views' },
    {
      folder: 'public',
      description:
        'Includes all the static assets and content used in the template',
    },
  ];

  return (
    <div className="mb-8">
      <SectionTitle
        title="Folders"
        subtitle="Important folders in the template"
      />

      <ol className="list-disc pl-6">
        {items.map((folder: any, i: any) => (
          <li className="mb-2" key={i}>
            <p className="mb-2">
              <code>{folder.folder}</code>
            </p>

            <p className="mb-2">{folder.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

export const Files: React.FunctionComponent<any> = () => {
  const filenames = [
    { filename: 'src/store.js', description: 'Redux config and global store' },
    {
      filename: 'tailwind.config.js',
      description: 'Tailwind SCSS default configuration',
    },
    {
      filename: 'postscss.config.js',
      description: 'PostSCSS configuration for plugins used in the template',
    },
    { filename: 'src/pages/index.js', description: 'Template entry page' },
    {
      filename: 'src/pages/_app.js',
      description:
        'Default Next.js component to initialize pages. SCSS files are imported here',
    },
    {
      filename: 'src/pages/_document.js',
      description:
        'Custom Next.js component used to add custom tags to the html and body tags',
    },
    {
      filename: 'src/scss/_variables.scss',
      description: 'Global SCSS variables',
    },
    {
      filename: 'src/scss/_components.scss',
      description: 'SCSS files for components are imported here',
    },
    {
      filename: 'src/scss/_layouts.scss',
      description: 'SCSS files for layouts are imported here',
    },
    {
      filename: 'src/scss/_palettes.scss',
      description: 'SCSS files for palettes are imported here',
    },
  ];

  return (
    <div className="mb-8">
      <SectionTitle title="Files" subtitle="Important files in the template" />

      <ol className="list-disc pl-6">
        {filenames.map((filename: any, i: any) => (
          <li className="mb-2" key={i}>
            <p className="mb-2">
              <code>{filename.filename}</code>
            </p>

            <p className="mb-2">{filename.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};
