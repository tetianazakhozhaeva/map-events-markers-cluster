import React from "react";
import { func, object } from "prop-types";
import { DESKTOP, getDeviceType, TABLET } from "../../helpers/detect-device";
import { getDivIcon } from "./icon-util";
import PlainEventMarker from "./plain-event-marker";
import { isInside } from "../Util";
import L from "leaflet";

const DEVICE_TYPE = getDeviceType();

class EventsCircle extends React.Component {
  static propTypes = {
    events: object,
    hidePopupInfo: func,
    clickHandler: func,
    showPopup: func
  };

  static contextTypes = {
    map: object
  };

  render() {
    const { events } = this.props;

    const size = DEVICE_TYPE === DESKTOP ? 22 : 26;

    const classname =
      DEVICE_TYPE === DESKTOP ? "halt-marker-desktop" : "halt-marker";

    const innerContent = `<div class=${classname}><span class="halt-marker__p">i</span></div>`;

    const innerIcon = getDivIcon(innerContent, size);

    const clickHandler = DEVICE_TYPE === DESKTOP ? () => {} : this.mouseOver;

    return (
      <PlainEventMarker
        coordinates={events.latLng}
        icon={innerIcon}
        onClickHandler={clickHandler}
        onMouseOverHandler={this.mouseOver}
        onMouseOutHandler={this.mouseOut}
      />
    );
  }

  mouseOver = e => {
    const { events } = this.props;

    if (DEVICE_TYPE === TABLET) {
      this.context.map.on("click", this.hidePopups);
    }

    if (
      !isInside(e.relatedTarget, "halt-marker-desktop") &&
      !isInside(e.relatedTarget, "leaflet-marker-icon")
    ) {
      const coords = this.context.map.latLngToContainerPoint(
        L.latLng(events.latLng.latitude, events.latLng.longitude)
      );

      this.props.clickHandler(events, coords);
    }
  };

  hidePopups = () => {
    this.props.hidePopupInfo();
    this.context.map.off("click", this.hidePopups);
  };

  mouseOut = e => {
    if (
      !isInside(
        e.relatedTarget,
        "halt-marker-desktop" &&
          !isInside(e.relatedTarget, "leaflet-marker-icon")
      ) &&
      !isInside(e.relatedTarget, "player-events-info")
    ) {
      this.props.hidePopupInfo();
    }
  };
}

export default EventsCircle;
