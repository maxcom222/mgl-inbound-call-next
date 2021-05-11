import React from 'react';

import Title from './title';

const Tags: React.FunctionComponent<any> = () => {
  const tags = [
    { title: 'Documents', color: 'green' },
    { title: 'Work', color: 'red' },
    { title: 'Clients', color: 'blue' },
    { title: 'Projects', color: 'yellow' },
  ];

  return (
    <div className="flex flex-col mb-4">
      <Title>Tags</Title>
      {tags.map((tag, i) => (
        <div
          key={i}
          className="flex items-center justify-start px-4 py-2 children-x-2"
        >
          <div className="flex-shrink-0">
            <span
              className={`h-2 w-2 bg-${tag.color}-500 flex items-center justify-center rounded-full`}
            ></span>
          </div>

          <p className="text-sm font-bold">{tag.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Tags;
