import React from 'react';
import {func, object} from 'prop-types';
import {DESKTOP, getDeviceType, PHONE, TABLET} from "../../helpers/detect-device";
import {getDivIcon} from "./icon-util";
import PlainEventMarker from "./plain-event-marker";
import {isInside, MAX_ZOOM} from "../Util";
import L from "leaflet";

const DEVICE_TYPE = getDeviceType();

class HaltCircle extends React.Component {

    static propTypes = {
        halt: object,
        hidePopupInfo: func,
        clickHandler: func,
        showPopup: func,
    };

    static contextTypes = {
        map: object
    };

    constructor(props) {
        super(props);

        this.state = {
            haltId: 0,
            isReturnButtonInvisible: false,
            lastZoom: 16,
            lastMapCenter: {},
            map: {}
        };

        this._isAfterClick = false;
        this._isPopupVisible = false;
    }

    componentWillUnmount() {
        if (this._isPopupVisible) {
            this.context.map.off('click', this.hidePopups);
            this.context.map.off('moveend', this.moveEndClicked);
        }
    }

    render() {
        const {halt} = this.props;

        const size = DEVICE_TYPE === DESKTOP ? 22 : 26;

        const classname = DEVICE_TYPE === DESKTOP ?
            "halt-marker-desktop" : "halt-marker";

        const innerContent = `<div class=${classname}><span class="halt-marker__p">P</span></div>`;

        const innerIcon = getDivIcon(innerContent, size);

        const processClickHandler = DEVICE_TYPE === PHONE ? this.mouseOver : this.click;

        return (
            <PlainEventMarker
                coordinates={halt}
                icon={innerIcon}
                onMouseOverHandler={this.mouseOver}
                onMouseOutHandler={this.mouseOut}
                onClickHandler={processClickHandler}
            />
        );
    }

    mouseOut = (e) => {
        if (!isInside(e.relatedTarget, 'halt-marker')) {
            this._isPopupVisible = false;
            if (this.state.isReturnButtonInvisible) {
                this.hidePopupAnimated();
            }
        }
    };

    mouseOver = (e) => {
        const {halt} = this.props;

        if (!isInside(e.relatedTarget, 'halt-marker')) {
            this._isPopupVisible = false;
            const coords = this.context.map.latLngToContainerPoint(
                L.latLng(halt.latitude, halt.longitude)
            );
            this.props.clickHandler(
                halt,
                coords,
                e,
                this.state.lastZoom,
                this.state.lastMapCenter,
                this.state.map
            );
        }
    };

    click = () => {
        const {halt} = this.props,
            pos = L.latLng(halt.latitude, halt.longitude),
            isReturnButtonInvisible = this.checkMaxZoom();
        let isPopupVisible = !this._isPopupVisible;

        this._isAfterClick = true;
        this._isPopupVisible = isPopupVisible;

        if (DEVICE_TYPE === TABLET) {
            this.context.map.on('click', this.hidePopups);
        }

        if (!isReturnButtonInvisible
            || this.context.map.getCenter().lat.toFixed(3) !== pos.lat.toFixed(3)
            || this.context.map.getCenter().lng.toFixed(3) !== pos.lng.toFixed(3)) {

            this.setState({
                lastZoom: this.context.map.getZoom(),
                lastMapCenter: this.context.map.getCenter(),
                map: this.context.map,
                isReturnButtonInvisible: isReturnButtonInvisible,
            });

            this.context.map.on('moveend', this.moveEndClicked);
            this.context.map.setView(pos, MAX_ZOOM);
        } else {
            this.showOrHidePopupHaltMarker(isPopupVisible);
        }
    };

    hidePopupAnimated = () => {
        this.props.showPopup({
            currentModal: 'HALT_INFO_POPUP_FOR_PLAYER',
            visible: false
        });
    };

    checkMaxZoom = () => {
        return MAX_ZOOM === this.context.map.getZoom();
    };

    showOrHidePopupHaltMarker = (isPopupVisible) => {
        const {halt} = this.props,
            coords = this.context.map.latLngToContainerPoint(
                L.latLng(halt.latitude, halt.longitude));

        if (isPopupVisible) {
            const isBtnReturnInvisible = Object.keys(this.state.map).length > 0 ? this.state.isReturnButtonInvisible : true;

            this.props.clickHandler(
                halt,
                coords,
                isBtnReturnInvisible,
                this.state.lastZoom,
                this.state.lastMapCenter,
                this.state.map
            );
        } else {
            this.props.hidePopupInfo();
        }

        this._isAfterClick = false;
    };

    hidePopups = () => {
        this.props.hidePopupInfo();
        this._isPopupVisible = false;
        this.context.map.off('click', this.hidePopups);
    };

    moveEndClicked = () => {
        this.showOrHidePopupHaltMarker(this._isPopupVisible);
        this.context.map.off('moveend', this.moveEndClicked);
    };

    moveEnd = () => {
        super.moveEnd();

        if (!this._isAfterClick)
            this._isPopupVisible = false;

        if (DEVICE_TYPE !== PHONE)
            this.props.hidePopupInfo();
    }
}

export default HaltCircle;
