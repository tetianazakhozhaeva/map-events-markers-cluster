import React from "react";
import { LayerGroup } from "react-leaflet";
import EventsMarkers from "./events-markers";
import { getDivIcon } from "../events-markers/icon-util";
import ExtendedSomeMarker from "./extended-some-marker";

export default class MiddleLayer extends LayerGroup {
  constructor() {
    super();
    this.state = {
      trackerState: null
    };
  }

  // componentWillMount() {
  //   this.marker = null;
  // }

  shouldComponentUpdate(nextProps) {
    return nextProps.isLayerVisible !== this.props.isLayerVisible;
  }

  render() {
    if (!this.props.isLayerVisible) {
      return null;
    }

    // todo marker icon
    const innerContent = `<div class="simple-marker"></div>`;
    const innerIcon = getDivIcon(innerContent, 30);

    return (
      <div>
        <ExtendedSomeMarker
          coordinate={{
            latitude: 50.01,
            longitude: 36.031
          }}
          icon={innerIcon}
        />
        <EventsMarkers {...this.props} />
      </div>
    );
  }
}
