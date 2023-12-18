import React, { useContext } from 'react';
import NotificationContext from './context';

export default ({ component: Component }) => {
  const context = useContext(NotificationContext);

  return (
    <>
      {context.notifications.map(props => (
        <Component
          key={props.id}
          onClose={() => context.update(props.id, 'open', false)}
          {...props}
        />
      ))}
    </>
  );
};
