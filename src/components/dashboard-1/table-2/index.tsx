import React from 'react';
import users from 'json/users.json';
import { pickRandom } from 'functions';
import { Badge } from 'components/badges';
import WidgetTitle from '../../widget-title';

const Table3: React.FunctionComponent<any> = ({ title, subtitle }: any) => (
  <>
    <div className="flex items-center justify-between">
      <WidgetTitle title={title} description={subtitle} />
    </div>

    <table className="table">
      <thead>
        <tr>
          <th>Name</th>

          <th>Title</th>

          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {users.slice(0, 5).map((user: any, i: any) => (
          <tr key={i}>
            <td>
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <img
                    className="h-10 w-10 rounded-full shadow"
                    src={`/assets/faces/${user.img}`}
                    alt={user.name}
                  />
                </div>

                <div className="ltr:ml-4 rtl:mr-4">
                  <div className="text-sm font-medium">{user.name}</div>

                  <div className={'text-secondary text-sm'}>{user.country}</div>
                </div>
              </div>
            </td>

            <td>
              <div className="flex items-center">
                <div className="flex flex-col">
                  <div className="text-sm font-medium">{user.company}</div>

                  <div className={'text-secondary text-sm'}>
                    {user.description}
                  </div>
                </div>
              </div>
            </td>

            <td>
              <Badge color={user.color} alt size="sm" rounded>
                {pickRandom(['online', 'offline'])}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

export default Table3;
