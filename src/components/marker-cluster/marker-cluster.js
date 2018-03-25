import React from 'react';
import PropTypes from 'prop-types';

// import { LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster'
import './MarkerCluster.Default.css'
import './MarkerCluster.css'
import HaltMarker from "../map-components/HaltMarker";

export default class MarkerCluster extends React.Component{

    static childContextTypes = {
        markerCluster: PropTypes.object
    };

    getChildContext() {
        return {
            markerCluster: this.leafletElement,
        };
    }

    componentDidMount(){
        this.leafletElement = L.markerClusterGroup();
        this.context.map.addLayer(this.leafletElement);
    }

    componentWillUnmount(){
        this.context.map.removeLayer(this.leafletElement);
    }

    render(){
        return null;
    }
}
MarkerCluster.contextTypes = {
    map: PropTypes.object
};
