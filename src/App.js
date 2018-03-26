import React, {Component} from 'react';
import {bool, object, func} from 'prop-types';
import {bindActionCreators} from 'redux';
import {Map, TileLayer, Marker} from 'react-leaflet';
import {connect} from 'react-redux';
import './App.css';
import './ExtendedMarkerHalt.css';
import './ExtendedMarkerNotification.css';
import './cluster-icon.css'
import MarkerClusterGroup from "./components/react-leaflet-marker-cluster/react-leaflet-marker-cluster";
import NotificationCircle from './components/events-markers/notification-circle'
import HaltCircle from "./components/events-markers/halt-circle";
import VehicleCircle from "./components/vehicle-marker/vehicle-circle";
import {getDivIcon} from "./components/events-markers/icon-util";

class App extends Component {
    static propTypes = {
        isEditing: bool.isRequired,
        notice: object.isRequired,
        setCoordinates: func.isRequired,
    };
    state = {
        lat: 50,
        lng: 36,
        zoom: 13,

        isNotifications: false,

        markerCoordinate: {
            latitude: 50.01,
            longitude: 36.031
        },

        halts: [
            {
                ignitionOffDuration: 0,
                ignitionOnDuration: 0,
                latitude: 50,
                longitude: 36,
                startHalt: 10,
                endHalt: 0
            },
            {
                ignitionOffDuration: 0,
                ignitionOnDuration: 0,
                latitude: 50,
                longitude: 36.02,
                startHalt: 10,
                endHalt: 0
            }

        ],
        notifications: [
            {
                latitude: 50.01,
                longitude: 36.03,
                trackerId: 1,
                type: 'fuelDrain'
            },
            {
                latitude: 50.01,
                longitude: 36.0301,
                trackerId: 1,
                type: 'fueling'
            },
            {
                latitude: 50.04,
                longitude: 36.04,
                trackerId: 1,
                type: 'fuelDrain'
            }
        ]
    };

    emptyFunc1 = (clusterLayer) => {
//todo ???

        console.log(clusterLayer.getAllChildMarkers().length)

        // 1 todo !!!! cluster.layer.getBounds()

        // todo !!!! cluster.propagatedFrom.getAllChildMarkers()[0]._latlng

    };

    emptyFunc = () => {
    }

    clickHandler = () => {
        this.setState({
            isNotifications: !this.state.isNotifications,
            halts: [],
            notifications: [],
        })
    };

    render() {
        const position = [this.state.lat, this.state.lng];

        const haltCircles = this.state.halts.map((item, index) => {
            return (<HaltCircle
                key={'halts' + index}
                index={index}
                halt={item}
                clickHandler={this.emptyFunc}
                hidePopupInfo={this.emptyFunc}
                showPopup={this.emptyFunc}
            />)
        });

        const notifications = this.state.notifications.map((item, key) => {

            let index = 0;

            return <NotificationCircle
                key={'notification' + key}
                index={index}
                notification={item}
            />
        });


        // todo marker icon
        const innerContent = `<div class="simple-marker"></div>`;
        const innerIcon = getDivIcon(innerContent, 30);

        // todo cluster icon
        const innerClusterContent = `<div class="events-cluster-icon">i</div>`;
        const innerClusterIcon = getDivIcon(innerClusterContent, 22);

        return <div className="App">
            <div className="container">
                <Map
                    center={position}
                    zoom={this.state.zoom}
                >
                    <TileLayer
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    />
                    {haltCircles}
                    <MarkerClusterGroup
                        onClusterClick={this.emptyFunc1}
                        options={
                            {
                                spiderfyOnMaxZoom: true,
                                showCoverageOnHover: false,
                                zoomToBoundsOnClick: false,
                                iconCreateFunction: function (cluster) {
                                    return innerClusterIcon;
                                }
                            }
                        }
                    >
                        {notifications}
                    </MarkerClusterGroup>
                    <MarkerClusterGroup>
                        <Marker position={[49.8397, 24.0297]}/>
                        <Marker position={[50.4501, 30.5234]}/>
                        <Marker position={[52.2297, 21.0122]}/>
                        <Marker position={[50.0647, 19.9450]}/>
                        <Marker position={[48.9226, 24.7111]}/>
                        <Marker position={[48.7164, 21.2611]}/>
                        <Marker position={[51.5, -0.09]}/>
                        <Marker position={[51.5, -0.09]}/>
                        <Marker position={[51.5, -0.09]}/>
                    </MarkerClusterGroup>

                    <VehicleCircle
                        coordinate={this.state.markerCoordinate}
                        icon={innerIcon}
                    />
                </Map>
                <button className="button" onClick={this.clickHandler}><span>Hover </span></button>
            </div>
        </div>;
    }
}

export default App;
