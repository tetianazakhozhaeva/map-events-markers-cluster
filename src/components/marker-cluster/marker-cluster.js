import React from "react";
import "leaflet.markercluster";
import { object } from "prop-types";
import L from "leaflet";
import "./MarkerCluster.Default.css";
import "./MarkerCluster.css";

export default class MarkerCluster extends React.Component {
  static childContextTypes = {
    layerContainer: object
  };

  static contextTypes = {
    map: object
  };

  getChildContext() {
    return {
      layerContainer: this.leafletElement
    };
  }

  componentWillMount() {
    const { options } = this.props;

    this.leafletElement = L.markerClusterGroup(options);

    this.initEventListeners(this.leafletElement);

    // this.props.children.map(el => {
    //   this.leafletElement.addlayer(el);
    // });

    // this.leafletElement.addLayers(this.props.children[0]);
    // this.leafletElement.addLayers(this.props.children[1]);

    this.context.map.addLayer(this.leafletElement);
  }

  componentWillUnmount() {
    this.context.map.removeLayer(this.leafletElement);
  }

  initEventListeners = () => {
    if (this.props.onClusterClick) {
      this.leafletElement.on("clusterclick", cluster => {
        this.props.onClusterClick(cluster.layer);
      });
    }
  };

  render() {
    // return <div>{this.props.children}</div>;
    return null;
  }
}
