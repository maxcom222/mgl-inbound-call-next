import React from 'react';
import SectionTitle from '../section-title';

export const Customization: React.FunctionComponent<any> = () => {
  const questions = [
    {
      question: 'How do I open the template?',
      answer: (
        <div>
          First, make sure the <code>next-app</code> package is installed. For
          more information go to{' '}
          <a
            href="https://nextjs.org/docs/getting-started"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            this url
          </a>
          . Then you need to run <code>npm install</code> or{' '}
          <code>yarn install</code> to install the template followed by{' '}
          <code>npm run dev</code> to start the development server
        </div>
      ),
    },
    {
      question:
        'I need an empty page to start developing. Where can I find one?',

      answer: (
        <div>
          Go to the <code>src/pages/empty-page.js</code> file
        </div>
      ),
    },
    {
      question: 'How can I change the navigation menus?',

      answer: (
        <div>
          We provide an empty example navigation file in{' '}
          <code>src/navigation/empty.js</code>. Replace{' '}
          <code>src/navigation/index.js</code> with the content of this file to
          start developing your own navigation menus.
        </div>
      ),
    },
    {
      question: 'How can I customize the side navigation?',

      answer: (
        <div>
          Side navigation options can be found in the <code>src/store.js</code>{' '}
          file.
        </div>
      ),
    },
    {
      question: 'How do I add a new page and/or route?',

      answer: (
        <div>
          Routes are handled automatically by <b>Next.js</b>. To add a new page
          copy any of the provided views or use the{' '}
          <code>src/pages/empty-page.js</code> as a starting point
        </div>
      ),
    },
    {
      question: 'How do I set a default and/or global page layout?',

      answer: (
        <div>
          Global layouts are defined in the <code>src/store.js</code> file. Also
          layouts can defined in every page by importing the layout directly
          from the <code>src/layouts</code> folder or by overriding the{' '}
          <code>redux</code> configuration. For examples go to the{' '}
          <code>src/pages/demo</code> folder.
        </div>
      ),
    },
    {
      question: 'Where can I find the colors available in the template?',

      answer: (
        <div>
          Colors are defined in the <code>tailwind.config.js</code> file in the{' '}
          <code>colors</code> section, in line 33. The same colors are copied to
          the <code>src/functions/colors.js</code> which makes them available
          for javascript components such as charts and maps.
        </div>
      ),
    },
    {
      question: 'How do I change the layout styles?',

      answer: (
        <div>
          Layouts colors are defined in the <code>src/scss/palettes</code>{' '}
          folder. In this folder you can find the palette definitions for the{' '}
          <code>
            background, left sidebar, logo, navbar, top navigation and right
            sidebar
          </code>{' '}
          components.
        </div>
      ),
    },
    {
      question: 'How do I add a scss file to the template?',

      answer: (
        <div>
          SCSS files are imported into the template by the{' '}
          <code>src/pages/_app.js</code> file. To add a new file just import it
          at the top of this file.
        </div>
      ),
    },
    {
      question:
        'How do I set the page background, left sidebar, navbar, logo, top navigation and right sidebar colors?',

      answer: (
        <div>
          Palette colors are defined in the <code>scss/_variables.scs</code>{' '}
          file and the color definitions for each palette are set in the{' '}
          <code>scss/palettes</code> and <code>scss/components</code> folders
        </div>
      ),
    },
    {
      question:
        'How do I change the colors of other elements and components, such as tables and dropdowns?',

      answer: (
        <div>
          Colors are defined for most elements in the{' '}
          <code>scss/components</code> folder and can either be set there
          globally or be modified using the <b>Tailwind SCSS</b> background,
          text and border color modifiers. All available modifiers are listed in
          the <code>http://localhost:3333/ui-elements/colors</code> page
        </div>
      ),
    },
    {
      question: 'I have a question, but it is not listed here, what can I do?',

      answer: (
        <div>
          Send us an email to support@mobifica.com or contact us through our
          Theme Forest profile and we&apos;ll do our best to try to help you
        </div>
      ),
    },
    {
      question:
        'I would like to see a new plugin installed or functionality developed in the template, is it possible?',

      answer: (
        <div>
          We are always trying to improve and adding new functionalities and
          plugins to the template, so every request is welcomed and will be
          evaluated
        </div>
      ),
    },
    {
      question: 'I found a bug, what can I do?',

      answer: (
        <div>
          Please let us know and we&apos;ll do our best to fix it as soon as
          possible
        </div>
      ),
    },
    {
      question: 'Are updates free?',

      answer: (
        <div>
          Yes, they are and always will be for our Themeforest customers
        </div>
      ),
    },
  ];

  return (
    <div className="mb-8">
      <SectionTitle
        title="Customization"
        subtitle="Frequently asked questions"
      />

      <ol className="list-disc pl-6 mb-4">
        {questions.map((question: any, i: any) => (
          <li className="mb-4" key={i}>
            <div className="mb-2 font-bold text-base">{question.question}</div>

            {question.answer}
          </li>
        ))}
      </ol>
    </div>
  );
};
