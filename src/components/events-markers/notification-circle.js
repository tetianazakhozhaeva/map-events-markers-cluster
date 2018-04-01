import React from "react";
import { func, number, object } from "prop-types";
import PlainEventMarker from "./plain-event-marker";
import { getDivIcon } from "./icon-util";
import { getDeviceType, DESKTOP, TABLET } from "../../helpers/detect-device";
import { isInside } from "../Util";
import L from "leaflet";

const DEVICE_TYPE = getDeviceType();

class NotificationCircle extends React.Component {
  static propTypes = {
    notification: object,
    index: number,
    hidePopupInfo: func,
    clickHandler: func,
    showPopup: func
  };

  static contextTypes = {
    map: object
  };

  render() {
    const { notification } = this.props;

    const size = DEVICE_TYPE === DESKTOP ? 22 : 26;

    const classname =
      DEVICE_TYPE === DESKTOP
        ? "notification-marker-desktop"
        : "notification-marker";

    const classnameRect =
      DEVICE_TYPE === DESKTOP
        ? "notification-marker__circle-desktop"
        : "notification-marker__circle";

    const innerContent = `<div class=${classname}><div class=${classnameRect}></div></div>`;

    const innerIcon = getDivIcon(innerContent, size);

    const clickHandler = DEVICE_TYPE === DESKTOP ? () => {} : this.mouseOver;

    return (
      <PlainEventMarker
        coordinates={notification}
        icon={innerIcon}
        onClickHandler={clickHandler}
        onMouseOverHandler={this.mouseOver}
        onMouseOutHandler={this.mouseOut}
      />
    );
  }

  mouseOver = e => {
    return null;

    const { notification, index } = this.props;

    if (DEVICE_TYPE === TABLET) {
      this.context.map.on("click", this.hidePopups);
    }

    if (!isInside(e.relatedTarget, "notification-marker")) {
      const coords = this.context.map.latLngToContainerPoint(
        L.latLng(notification.latitude, notification.longitude)
      );

      this.props.clickHandler(notification, coords, index);
    }
  };

  mouseOut = e => {
    return null;

    if (!isInside(e.relatedTarget, "notification-marker")) {
      this.hidePopupAnimated();
    }
  };

  hidePopupAnimated = () => {
    this.props.showPopup({
      currentModal: "NOTIFICATION_INFO_POPUP",
      visible: false
    });
  };

  hidePopups = () => {
    this.props.hidePopupInfo();
    this.context.map.off("click", this.hidePopups);
  };
}

export default NotificationCircle;
