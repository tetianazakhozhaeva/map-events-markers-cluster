import React from 'react';
import {func, object} from 'prop-types';
import L from 'leaflet';
import {
    getDeviceType, DESKTOP,
} from '../../helpers/detect-device';

const DEVICE_TYPE = getDeviceType();

class PlainEventMarker extends React.Component {

    static propTypes = {
        coordinates: object,
        icon: object,
        onMouseOverHandler: func,
        onMouseOutHandler: func,
        onClickHandler: func,
    };

    static contextTypes = {
        map: object,
        layerContainer: object,
    };

    componentDidMount() {
        const {
            coordinates,
            icon
        } = this.props;

        const options = {
            icon,
            zIndexOffset: -1000
            // pane: 'overlayPane'
        };

        this._leafletElement = L.marker(L.latLng(coordinates.latitude, coordinates.longitude), options);

        // this._leafletElement.addTo(this.context.map);
// todo??
        this._leafletElement.addTo(this.context.layerContainer);

        this.registerEventListeners();
    }

    componentWillUnmount() {
        this.offEventListeners();

        this.context.layerContainer.removeLayer(this._leafletElement);


        this._leafletElement.remove();
    }

    render() {
        return null;
    }

    registerEventListeners = () => {
        if(DEVICE_TYPE === DESKTOP){
            this._leafletElement.on('mouseover', this.props.onMouseOverHandler);
            this._leafletElement.on('mouseout', this.props.onMouseOutHandler);
            this._leafletElement.on('click', this.props.onClickHandler);
        } else {
            this._leafletElement.on('click', this.props.onClickHandler);
        }
    };

    offEventListeners = () => {
        this._leafletElement.off();
    };
}

export default PlainEventMarker;
