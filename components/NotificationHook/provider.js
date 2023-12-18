import React, { useState } from 'react';
import NotificationContext from './context';
import NotificationContainer from './container';

export default ({ children, component }) => {
  const [notifications, setNotifications] = useState([]);

  const push = obj => {
    const data = [...notifications].filter((item, index) => index < 2 || item.open);

    data.push(obj);
    setNotifications(data);
  };

  const pop = () => {
    const data = [...notifications];
    data.pop();
    setNotifications(data);
  };

  const update = (id, prop, value) => {
    const index = notifications.findIndex(elem => elem.id === id);
    const item = Object.assign({}, notifications[index]);

    item[prop] = value;

    const data = [...notifications];
    data.splice(index, 1, item);

    setNotifications(data);
  };

  return (
    <>
      <NotificationContext.Provider
        value={{
          notifications,
          push,
          pop,
          update,
        }}
      >
        {children}
        <NotificationContainer component={component} />
      </NotificationContext.Provider>
    </>
  );
};
