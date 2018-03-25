import React from 'react';
import {object} from 'prop-types';
import PlainEventCircle from "./plain-event-circle";

class NotificationCircle extends React.Component {

    static propTypes = {
        notification: object,
    };

    render(){
        const {notification} = this.props;

        return (
            <PlainEventCircle
                coordinate={notification}
                className={'notification-marker__circle'}
                color={'#0000FF'}
                fillColor={'#ffffff'}
                opacity={1}
                weight={3}
                fill={true}
                radius={20}
            />
        );
    }
}

export default NotificationCircle;
