import React from 'react';

import { ProgressBar } from 'components/progress-bars';

import tasks from 'json/tasks.json';

const Projects: React.FunctionComponent<any> = () => (
  <div className="flex flex-col mb-4">
    <div className="uppercase font-bold text-xs tracking-wider p-4">
      Projects
    </div>

    <div className="flex flex-col pt-2">
      {tasks.map((item: any, i: any) => (
        <div className={' flex flex-col px-4 mb-4'} key={i}>
          <div className="flex items-center justify-between mb-2">
            <div className={'text-sm'}>{item.title}</div>

            <div className={'text-xs'}>{item.percent}%</div>
          </div>

          <ProgressBar width={parseInt(item.percent, 10)} color={item.color} />
        </div>
      ))}
    </div>
  </div>
);

export default Projects;
