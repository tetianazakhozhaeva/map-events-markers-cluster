import React from 'react';
import L from "leaflet";
import {object} from "prop-types";
import './vehicle-circle.css'

class VehicleCircle extends React.Component {

    static contextTypes = {
        map: object,
    };

    componentDidMount() {
        const {
            coordinate,
            icon
        } = this.props;

        const options = {
            icon,
            zIndexOffset: 1000,
        };

        this._leafletElement = L.marker(L.latLng(coordinate.latitude, coordinate.longitude), options);

        this._leafletElement.addTo(this.context.map);
    }

    componentWillUnmount() {
        this._leafletElement.remove();
    }

    render() {
        return null;
    }
}

export default VehicleCircle;
