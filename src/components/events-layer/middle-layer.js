import React from "react";
import { LayerGroup } from "react-leaflet";
import EventsMarkers from "./events-markers";

export default class MiddleLayer extends LayerGroup {
  render() {
    return <EventsMarkers {...this.props} />;
  }
}
