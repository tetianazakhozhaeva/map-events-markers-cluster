import React, { Component } from "react";
import { bool, object, func } from "prop-types";
import { bindActionCreators } from "redux";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { connect } from "react-redux";
import "./App.css";
import "./ExtendedMarkerHalt.css";
import "./ExtendedMarkerNotification.css";
import "./cluster-icon.css";
import MarkerClusterGroup from "./components/react-leaflet-marker-cluster/react-leaflet-marker-cluster";
import VehicleCircle from "./components/vehicle-marker/vehicle-circle";
import { getDivIcon } from "./components/events-markers/icon-util";
import PlainPopup from "./components/popups/plain-popup";
import EventsMarkers from "./components/events-layer/events-markers";
import MiddleLayer from "./components/events-layer/middle-layer";

class App extends Component {
  static propTypes = {
    isEditing: bool.isRequired,
    notice: object.isRequired,
    setCoordinates: func.isRequired
  };
  state = {
    lat: 50,
    lng: 36,
    zoom: 13,

    isPopupVisible: false,

    isNotifications: false,

    markerCoordinate: {
      latitude: 50.01,
      longitude: 36.031
    },

    isLayerVisible: false
  };

  emptyFunc1 = clusterLayer => {
    //todo ???

    console.log(clusterLayer.getAllChildMarkers().length);

    clusterLayer.getAllChildMarkers();

    this.setState({
      isPopupVisible: !this.state.isPopupVisible
    });

    // todo !!!! cluster.propagatedFrom.getAllChildMarkers()[0]._latlng
  };

  emptyFunc = () => {};

  clickHandler = () => {
    this.setState({
      isNotifications: !this.state.isNotifications,
      // halts: [],
      notifications: [],

      isLayerVisible: !this.state.isLayerVisible
    });
  };

  render() {
    const position = [this.state.lat, this.state.lng];

    // todo marker icon
    const innerContent = `<div class="simple-marker"></div>`;
    const innerIcon = getDivIcon(innerContent, 30);

    // todo cluster icon
    // const innerClusterContent = `<div class="events-cluster-icon">i</div>`;
    // const innerClusterIcon = getDivIcon(innerClusterContent, 22);

    return (
      <div className="App">
        <div className="container">
          <Map center={position} zoom={this.state.zoom} maxZoom={18}>
            <TileLayer
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
              url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
            />

            {/*<MarkerClusterGroup*/}
            {/*onClusterClick={this.emptyFunc1}*/}
            {/*options={{*/}
            {/*spiderfyOnMaxZoom: false,*/}
            {/*showCoverageOnHover: false,*/}
            {/*zoomToBoundsOnClick: false,*/}
            {/*iconCreateFunction: function(cluster) {*/}
            {/*return innerClusterIcon;*/}
            {/*}*/}
            {/*}}*/}
            {/*>*/}
            {/*{notifications}*/}
            {/*{haltCircles}*/}
            {/*<PlainPopup*/}
            {/*position={[50.01, 36.0301]}*/}
            {/*isPopupVisible={this.state.isPopupVisible}*/}
            {/*>*/}
            {/*<span>content</span>*/}
            {/*</PlainPopup>*/}
            {/*</MarkerClusterGroup>*/}

            {/*<EventsMarkers isNotifications={this.state.isNotifications} />*/}
            <MiddleLayer isLayerVisible={this.state.isLayerVisible} />
            <MarkerClusterGroup>
              <Marker position={[49.8397, 24.0297]} />
              <Marker position={[50.4501, 30.5234]} />
              <Marker position={[52.2297, 21.0122]} />
              <Marker position={[50.0647, 19.945]} />
              <Marker position={[48.9226, 24.7111]} />
              <Marker position={[48.7164, 21.2611]} />
              <Marker position={[51.5, -0.09]} />
              <Marker position={[51.5, -0.09]} />
              <Marker position={[51.5, -0.09]} />
            </MarkerClusterGroup>
            {/*<VehicleCircle*/}
            {/*coordinate={this.state.markerCoordinate}*/}
            {/*icon={innerIcon}*/}
            {/*/>*/}
          </Map>
          <button className="button" onClick={this.clickHandler}>
            <span>Hover </span>
          </button>
        </div>
      </div>
    );
  }
}

export default App;
