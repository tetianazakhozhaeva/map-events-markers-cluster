import {Component} from "react";
import PropTypes from 'prop-types';
import L from "leaflet";

import {
    getDeviceType,
    DESKTOP,
} from '../../../../helpers/detect-device';

const DEVICE_TYPE = getDeviceType();

class _CircleMarker extends Component {

    constructor() {
        super();

        this.setPosition = this.setPosition.bind(this);
        this.setTrackerState = this.setTrackerState.bind(this);
        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.click = this.click.bind(this);

        this.openPopup = this.openPopup.bind(this);
    }

    componentWillMount() {
        const {
            trackerState, opacity, fill,
            fillOpacity, fillColor, weight,
            minRadius, color,
            maxRadius
        } = this.props;

        let radius = minRadius;

        if (DEVICE_TYPE !== DESKTOP)
            radius = maxRadius - 2;


        const options = {
            opacity: opacity,
            fill: fill,
            fillOpacity: fillOpacity,
            fillColor: fillColor,
            weight: weight,
            radius: radius,
            color: color
        };

        const _circle = L.circleMarker(
            L.latLng(trackerState.latitude, trackerState.longitude),
            options
        );

        if (DEVICE_TYPE === DESKTOP) {
            _circle.on('mouseover', this.mouseOver);
            _circle.on('mouseout', this.mouseOut);
        }

        _circle.on('click', this.click);
        _circle.addTo(this.context.map);

        _circle.bringToFront();

        this.state = {
            options: options,
            trackerState: this.props.trackerState,
            circle: _circle
        };

        if (this.props.trackerState) this.setPosition(this.props.trackerState);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.trackerState !== this.props.trackerState) {
            this.setTrackerState(nextProps.trackerState);
            this.setPosition(nextProps.trackerState);
        }
    }

    setPosition(trackerState) {
        const {circle} = this.state;
        circle.setLatLng(
            L.latLng(trackerState.latitude, trackerState.longitude)
        );
    }

    mouseOver() {
        const {circle} = this.state;
        circle.setRadius(this.props.maxRadius);
    }

    mouseOut() {
        const {circle} = this.state;
        circle.setRadius(this.props.minRadius);
    }

    click() {
        this.openPopup();
    }

    openPopup() {
        const {trackerState} = this.state;
        const position = this.context.map.latLngToContainerPoint(
            L.latLng(trackerState.latitude, trackerState.longitude)
        );
        this.props.click(trackerState, position, this.props.index);
    }

    setTrackerState(trackerState) {
        this.setState({trackerState: trackerState});
    }

    componentWillUnmount() {
        const {circle} = this.state;

        if (DEVICE_TYPE === DESKTOP) {
            circle.off('mouseover', this.mouseOver);
            circle.off('mouseout', this.mouseOut);
        }

        circle.off('click', this.click);
        circle.remove();
    }

    render() {
        return null;
    }
}

_CircleMarker.contextTypes = {
    map: PropTypes.object
};

_CircleMarker.propTypes = {
    timeStamp: PropTypes.number,
    trackerState: PropTypes.object,
    opacity: PropTypes.number,
    fill: PropTypes.bool,
    fillOpacity: PropTypes.number,
    fillColor: PropTypes.string,
    weight: PropTypes.number,
    click: PropTypes.func,
    maxRadius: PropTypes.number,
    minRadius: PropTypes.number,
    index: PropTypes.number,
    color: PropTypes.string,
};

export default _CircleMarker