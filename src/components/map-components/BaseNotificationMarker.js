/**
 * Created by tetiana on 26.10.17.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import L from 'leaflet';

import {
    getDeviceType, DESKTOP
} from '../../helpers/detect-device'

import classnames from 'classnames';

const DEVICE_TYPE = getDeviceType();

export default class BaseNotificationMarker extends Component {

    constructor(props) {
        super(props);

        this.moveEnd = this.moveEnd.bind(this);
        this.recalculate = this.recalculate.bind(this);
        this.setPosition = this.setPosition.bind(this);
        this.getMarkerRefName = this.getMarkerRefName.bind(this);
        this.click = this.click.bind(this);
        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
    }

    click() {
    }

    mouseOver() {
    }

    mouseOut() {
    }

    componentDidMount() {
        const {index, trackerState} = this.props;

        this._markerContainer = findDOMNode(this.divContainer);
        this.context.map.getPanes().overlayPane.appendChild(this._markerContainer);

        this.context.map.on('moveend', this.moveEnd);

        const pos = this.context.map.latLngToLayerPoint(
            L.latLng(trackerState.latitude, trackerState.longitude)
        );

        this.setPosition(pos, index);
    }

    componentWillUnmount() {
        this.context.map.off('moveend', this.moveEnd);
        if (this.context.map.getPanes().length) {
            this.context.map.getPanes().overlayPane.removeChild(this._markerContainer);
        }
    }

    moveEnd() {
        this.recalculate();
    }

    setPosition(pos, index) {
        const markerElement = findDOMNode(
            this.refs[this.getMarkerRefName(index)]
        );

        if (markerElement)
            L.DomUtil.setPosition(markerElement, pos);
    }

    recalculate() {
        const {index, trackerState} = this.props;

        const pos = this.context.map.latLngToLayerPoint(
            L.latLng(trackerState.latitude, trackerState.longitude)
        );
        this.setPosition(pos, index);
    }

    getMarkerRefName(index) {
        return `notification${index}`;
    }

    render() {
        const {index} = this.props;

        const classname = classnames({
            'notification-marker': true,
            'notification-marker-desktop': DEVICE_TYPE === DESKTOP,
        });

        const classnameRect = classnames({
            'notification-marker__circle': true,
            'notification-marker__circle-desktop': DEVICE_TYPE === DESKTOP,
        });

        const marker = DEVICE_TYPE === DESKTOP ?
            this.renderForDesktop(index, classname, classnameRect) :
            this.renderForTapDevices(index, classname, classnameRect);

        return (
            <div
                ref={(div) => {
                    this.divContainer = div
                }}
                className={
                    `leaflet-pane`
                }
            >
                {marker}
            </div>
        );
    }

    renderForDesktop(index, className, classnameRect) {
        return (
            <div className={className}
                 style={{cursor: 'default'}}
                 ref={this.getMarkerRefName(index)}
                 onMouseOver={this.mouseOver}
                 onMouseOut={this.mouseOut}
            >
                <div className={classnameRect}/>
            </div>
        )
    }

    renderForTapDevices(index, className, classnameRect) {
        return (
            <div
                className={className}
                style={{cursor: 'default'}}
                ref={this.getMarkerRefName(index)}
                onClick={this.mouseOver}
            >
                <div className={classnameRect}/>
            </div>
        )
    }
}

BaseNotificationMarker.contextTypes = {
    map: PropTypes.object
};

BaseNotificationMarker.propTypes = {
    notification: PropTypes.object,
    trackerState: PropTypes.object,
    index: PropTypes.number,
    clickHandler: PropTypes.func,
    hidePopupInfo: PropTypes.func,
}
