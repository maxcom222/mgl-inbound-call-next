import React from 'react';

import SectionTitle from '../section-title';

export const Credits: React.FunctionComponent<any> = () => {
  const items = [
    {
      title: 'React',
      description: 'A JavaScript library for building user interfaces',
      url: 'https://reactjs.org/',
    },
    {
      title: 'Next.js',
      description: 'The React Framework for production',
      url: 'https://nextjs.org/',
    },
    {
      title: 'Create React App',
      description: 'Set up a modern web app by running one command',
      url: 'https://create-react-app.dev/',
    },
    {
      title: 'Tailwind CSS',
      description:
        'A utility-first CSS framework for rapidly building custom designs',
      url: 'https://tailwindcss.com/',
    },
    {
      title: 'Redux',
      description: 'A Predictable State Container for JS Apps',
      url: 'https://redux.js.org/',
    },
    {
      title: 'React Redux',
      description: 'Official React bindings for Redux',
      url: 'https://react-redux.js.org/',
    },
    {
      title: 'Google fonts',
      description:
        'Making the web more beautiful, fast, and open through great typography',

      url: 'https://fonts.google.com/',
    },
    {
      title: 'Unsplash',
      description: 'Free (do whatever you want) high-resolution photos',
      url: 'https://unsplash.com/',
    },
    {
      title: 'Feather',
      description: 'Simply beautiful open source icons',
      url: 'https://feathericons.com/',
    },
    {
      title: 'flag-icon-css',
      description:
        'A collection of all country flags in SVG plus the CSS for easier integration.',
      url: 'http://flag-icon-css.lip.is/',
    },
    {
      title: 'Simple line icons',
      description: 'Simple and Minimal Line Icons',
      url: 'https://github.com/thesabbir/simple-line-icons',
    },
    {
      title: 'DataMaps',
      description:
        'Customizable SVG map visualizations for the web in a single Javascript file using D3.js',
      url: 'http://datamaps.github.io/',
    },
    {
      title: 'GetTerms.io',
      description: 'Privacy Policy Generator',
      url: 'https://getterms.io/',
    },
    {
      title: 'Chart.js',
      description:
        'Simple yet flexible JavaScript charting for designers & developers',
      url: 'https://www.chartjs.org/',
    },
    // {title: '', description: '', url: ''},
  ];

  return (
    <div className="mb-8">
      <SectionTitle
        title="Credits"
        subtitle="Frameworks, scripts and dependencies used in the template"
      />
      <div className="flex">
        <div className="w-full">
          <ol className="list-disc pl-6">
            {items.map((item: any, i: any) => (
              <li key={i} className="mb-4">
                &apos;div&apos;.
                <div className="mb-2 font-bold font-poppins font-base">
                  &apos;a&apos;.
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </div>
                &apos;p&apos;.
                <p className="mb-2 leading-7">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};
