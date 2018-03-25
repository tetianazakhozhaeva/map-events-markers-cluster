/**
 * Created by tetiana on 17.08.17.
 */
import BaseHaltMarker from './BaseHaltMarker'
import PropTypes from 'prop-types';

import {
    isInside,
    MAX_ZOOM,
} from '../Util'
import L from 'leaflet';
import {
    getDeviceType,
    TABLET, PHONE
} from '../../helpers/detect-device'

const DEVICE_TYPE = getDeviceType();

export default class HaltMarker extends BaseHaltMarker {

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

        this.click = this.click.bind(this);
        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.moveEndClicked = this.moveEndClicked.bind(this);
        this.moveEnd = this.moveEnd.bind(this);
        this.checkMaxZoom = this.checkMaxZoom.bind(this);
        this.hidePopupAnimated = this.hidePopupAnimated.bind(this);
        this.hidePopups = this.hidePopups.bind(this);
    }

    componentWillMount() {
        this.setState({
            haltId: this.props.halt.startHalt,
        })
    }

    componentDidMount() {
        super.componentDidMount();
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this._isPopupVisible) {
            this.context.map.off('click', this.hidePopups);
            this.context.map.off('moveend', this.moveEndClicked);
        }
    }

    hidePopupAnimated() {
        this.props.showPopup({
            currentModal: 'HALT_INFO_POPUP_FOR_PLAYER',
            visible: false
        });
    }

    checkMaxZoom() {
        return MAX_ZOOM === this.context.map.getZoom();
    }

    mouseOut(e) {
        if (!isInside(e.relatedTarget, 'halt-marker')) {
            this._isPopupVisible = false;
            if (this.state.isReturnButtonInvisible) {
                this.hidePopupAnimated();
            }
        }
    }

    mouseOver(e) {
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
    }

    click() {
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
    }

    showOrHidePopupHaltMarker(isPopupVisible) {
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
    }

    hidePopups() {
        this.props.hidePopupInfo();
        this._isPopupVisible = false;
        this.context.map.off('click', this.hidePopups);
    }

    moveEndClicked() {
        this.showOrHidePopupHaltMarker(this._isPopupVisible);
        this.context.map.off('moveend', this.moveEndClicked);
    }

    moveEnd() {
        super.moveEnd();

        if (!this._isAfterClick)
            this._isPopupVisible = false;

        if (DEVICE_TYPE !== PHONE)
            this.props.hidePopupInfo();
    }
}

HaltMarker.contextTypes = {
    map: PropTypes.object
};
