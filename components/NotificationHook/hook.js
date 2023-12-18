import React, { useContext } from 'react';
import NotificationContext from './context';

export default () => {
  const context = useContext(NotificationContext);

  const push = (type, message, props) => {
    const id = (+new Date() * Math.random()).toString(32);
    context.push({
      type,
      message,
      id,
      open: true,
      ...props,
    });
  };

  return {
    showSuccess: (message, props) => push('success', message, props),
    showInfo: (message, props) => push('info', message, props),
    showWarning: (message, props) => push('warning', message, props),
    showError: (message, props) => push('error', message, props),
  };
};
