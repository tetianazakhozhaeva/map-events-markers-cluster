/**
 * Created by tetiana on 17.08.17.
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import L from 'leaflet';

import {
    getDeviceType, DESKTOP, TABLET
} from '../../helpers/detect-device'

import classnames from 'classnames';

const DEVICE_TYPE = getDeviceType();

export default class BaseHaltMarker extends Component {

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

    click() {}

    mouseOver() {}

    mouseOut() {}

    componentDidMount() {
        const {halt, index} = this.props;

        this._markerContainer = findDOMNode(this.divContainer);
        this.context.map.getPanes().overlayPane.appendChild(this._markerContainer);

        // todo !!!!
        // this.context.map.getPanes().markerPane.appendChild(this._markerContainer);
        // this.context.markerCluster.addLayer(this._markerContainer);

        this.context.map.on('moveend', this.moveEnd);

        const pos = this.context.map.latLngToLayerPoint(
            L.latLng(halt.latitude, halt.longitude)
        );

        this.setPosition(pos, index);
    }

    componentWillUnmount() {
        this.context.map.off('moveend', this.moveEnd);

        // this.context.map.removeLayer(this)

        console.log(11111)

        // if(this.context.map.getPanes().length){
            this.context.map.getPanes().overlayPane.removeChild(this._markerContainer);
        // }




        // todo !!!!!
        // this.context.map.getPanes().markerPane.removeChild(this._markerContainer);
        // this.context.markerCluster.removeLayer(this);

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
        const {halt, index} = this.props;

        const pos = this.context.map.latLngToLayerPoint(
            L.latLng(halt.latitude, halt.longitude)
        );
        this.setPosition(pos, index);
    }

    getMarkerRefName(index) {
        return `halt${index}`;
    }

    render() {
        const {index} = this.props;

        const classname = classnames({
            'halt-marker': true,
            'halt-marker-desktop': DEVICE_TYPE === DESKTOP,
        });

        const classnameRect = classnames({
            'halt-marker__rectangle': true,
            'halt-marker__rectangle-desktop': DEVICE_TYPE === DESKTOP,
        });

        const marker = DEVICE_TYPE === DESKTOP ?
            this.renderForDesktop(index, classname, classnameRect) :
            this.renderForTapDevices(index, classname, classnameRect);

        return (
            <div
                 ref={(div) => { this.divContainer = div }}
                 className={
                     `leaflet-pane`
                 }
            >
                {marker}
            </div>
        );
    }

    renderForDesktop(index, className) {
        return (
            <div className={className}
                 style={{cursor: 'default'}}
                 ref={this.getMarkerRefName(index)}
                 onMouseOver={this.mouseOver}
                 onClick={this.click}
                 onMouseOut={this.mouseOut}
            >
                <span className="halt-marker__p">P</span>
            </div>
        )
    }

    renderForTapDevices(index, className) {

        const processClickHandler = DEVICE_TYPE === TABLET ? this.click : this.mouseOver;

        return (
            <div
                className={className}
                style={{cursor: 'default'}}
                ref={this.getMarkerRefName(index)}
                onClick={processClickHandler}
            >
                <span className="halt-marker__p">P</span>
            </div>
        )
    }

}

BaseHaltMarker.contextTypes = {
    map: PropTypes.object,

    markerCluster:  PropTypes.object,
};

BaseHaltMarker.propTypes = {
    halt: PropTypes.object,
    index: PropTypes.number,
    clickHandler: PropTypes.func,
    hidePopupInfo: PropTypes.func,
}
