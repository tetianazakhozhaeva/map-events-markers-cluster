/**
 * Created by tetiana on 26.10.17.
 */
import BaseNotificationMarker from './BaseNotificationMarker'
import PropTypes from 'prop-types';

import {
    isInside,
} from '../Util'
import L from 'leaflet';
import {
    getDeviceType,
    TABLET
} from '../../helpers/detect-device'

const DEVICE_TYPE = getDeviceType();

export default class NotificationMarker extends BaseNotificationMarker {

    constructor(props) {
        super(props);

        this.click = this.click.bind(this);
        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.hidePopupAnimated = this.hidePopupAnimated.bind(this);
        this.hidePopups = this.hidePopups.bind(this);
    }

    mouseOver(e) {
        const {trackerState, notification, index} = this.props;

        if (DEVICE_TYPE === TABLET) {
            this.context.map.on('click', this.hidePopups);
        }

        if (!isInside(e.relatedTarget, 'notification-marker')) {
            const coords = this.context.map.latLngToContainerPoint(
                L.latLng(trackerState.latitude, trackerState.longitude)
            );

            this.props.clickHandler(
                trackerState,
                notification,
                coords,
                index
            );
        }
    }

    hidePopupAnimated() {
        this.props.showPopup({
            currentModal: 'NOTIFICATION_INFO_POPUP',
            visible: false
        });
    }

    hidePopups() {
        this.props.hidePopupInfo();
        this.context.map.off('click', this.hidePopups);
    }

    mouseOut(e) {
        if (!isInside(e.relatedTarget, 'notification-marker')) {
            this.hidePopupAnimated();
        }
    }
}

NotificationMarker.propTypes = {
    notification: PropTypes.object,
    trackerState: PropTypes.object,
    index: PropTypes.number,
    hidePopupInfo: PropTypes.func,
}
