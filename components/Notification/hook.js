import React, { useContext } from 'react'
import NotificationContext from './context'

export default () => {
    const context = useContext(NotificationContext)

    const push = (type, message, duration = 5000) => {
        const id = (+(new Date()) * Math.random()).toString(32);
        context.push({
            type, 
            message, 
            duration,
            id,
            open: true,
        })
    }

    return {
        showSuccess: (message, duration) => push('success', message, duration),
        showInfo: (message, duration) => push('info', message, duration),
        showWarning: (message, duration) => push('warning', message, duration),
        showError: (message, duration) => push('error', message, duration),
    }
};
 