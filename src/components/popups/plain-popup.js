import React from "react";
import { object, string } from "prop-types";
import L from "leaflet";

class PlainPopup extends React.Component {
  static contextTypes = {
    map: object,
    popupContainer: object
  };

  componentDidMount() {
    const { position } = this.props;
    const { popupContainer } = this.context;

    this.leafletElement = L.popup().setLatLng(position);

    if (popupContainer) {
      // Attach to container component
      popupContainer.bindPopup(this.leafletElement);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.position !== nextProps.position) {
      this.leafletElement.setLatLng(nextProps.position);
    }
    if (this.props.isPopupVisible !== nextProps.isPopupVisible) {
      if (nextProps.isPopupVisible) {
        this.leafletElement.openPopup(nextProps.position);
      } else {
        this.leafletElement.closePopup();
      }
    }
  }

  componentWillUnmount() {
    this.context.map.removeLayer(this.leafletElement);
  }

  render() {
    return <div>content content</div>;
  }
}

export default PlainPopup;
