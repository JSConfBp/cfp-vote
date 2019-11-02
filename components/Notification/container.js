import React, { useContext, useEffect } from 'react'
import NotificationContext from './context'
import Component from './component'

export default () => {
    const context = useContext(NotificationContext)

    return (<>
        {context.notifications.map((props) => (<Component 
            key={ props.id }
            onClose={ () => context.update(props.id, 'open', false) } 
            { ...props } 
        />))}
    </>)
};
 