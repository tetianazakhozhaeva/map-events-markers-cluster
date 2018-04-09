import React from "react";
import HaltCircle from "../events-markers/halt-circle";
import NotificationCircle from "../events-markers/notification-circle";
import MarkerCluster from "../marker-cluster/marker-cluster";
import { getDivIcon } from "../events-markers/icon-util";
import { LayerGroup } from "react-leaflet";
import MarkerClusterGroup from "../react-leaflet-marker-cluster/react-leaflet-marker-cluster";

export default class EventsMarkers extends LayerGroup {
  constructor() {
    super();

    this.state = {
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
          type: "fuelDrain"
        },
        {
          latitude: 50.01,
          longitude: 36.0301,
          trackerId: 1,
          type: "fueling"
        },
        {
          latitude: 50.04,
          longitude: 36.04,
          trackerId: 1,
          type: "fuelDrain"
        }
      ]
    };

    this.emptyFunc1 = this.emptyFunc1.bind(this);
  }

  emptyFunc1(clusterLayer) {
    //todo ???

    console.log(clusterLayer.getAllChildMarkers().length);

    const childMarkers = clusterLayer.getAllChildMarkers();

    const notificationsInCluster = this.state.notifications.filter(n => {
      let b = false;
      for (let i = 0; i < childMarkers.length; i++) {
        if (
          n.latitude === childMarkers[i].getLatLng().lat &&
          n.longitude === childMarkers[i].getLatLng().lng
        ) {
          b = true;
          break;
        }
      }
      return b;
    });

    const haltsInCluster = this.state.halts.filter(h => {
      let b = false;
      for (let i = 0; i < childMarkers.length; i++) {
        if (
          h.latitude === childMarkers[i].getLatLng().lat &&
          h.longitude === childMarkers[i].getLatLng().lng
        ) {
          b = true;
          break;
        }
      }
      return b;
    });

    // content for popup
    console.log(notificationsInCluster);
    console.log(haltsInCluster);

    // this.setState({
    //   isPopupVisible: !this.state.isPopupVisible
    // });

    // todo !!!! cluster.propagatedFrom.getAllChildMarkers()[0]._latlng
  }

  render() {
    const haltCircles = this.state.halts.map((item, index) => {
      return (
        <HaltCircle
          key={"halts" + index}
          index={index}
          halt={item}
          clickHandler={this.emptyFunc}
          hidePopupInfo={this.emptyFunc}
          showPopup={this.emptyFunc}
        />
      );
    });

    const notifications = this.state.notifications.map((item, key) => {
      let index = 0;

      return (
        <NotificationCircle
          key={"notification" + key}
          index={index}
          notification={item}
        />
      );
    });

    // todo cluster icon
    const innerClusterContent = `<div class="events-cluster-icon">i</div>`;
    const innerClusterIcon = getDivIcon(innerClusterContent, 22);

    return (
      <MarkerClusterGroup
        onClusterClick={this.emptyFunc1}
        options={{
          spiderfyOnMaxZoom: false,
          showCoverageOnHover: false,
          zoomToBoundsOnClick: false,
          iconCreateFunction: function(cluster) {
            return innerClusterIcon;
          }
        }}
      >
        {notifications}
        {haltCircles}
      </MarkerClusterGroup>
    );
  }
}
