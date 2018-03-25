import {Component} from "react";
import PropTypes from 'prop-types'
import L from "leaflet";

class _Polyline extends Component {

    constructor(){
        super();

        this.setPosition = this.setPosition.bind(this);
    }

    componentWillMount(){
        const { points, opacity,
            fill, color, weight
        } = this.props;

        const options = {
            color: color,
            opacity: opacity,
            fill: fill,
            weight: weight
        };

        const polyline = L.polyline(
            points,
            options
        );

        polyline.addTo(this.context.map);

        polyline.bringToBack();

        this.state = {
            options: options,
            points: points,
            polyline: polyline
        };

        if(this.props.trackerState) this.setPosition(this.props.trackerState);
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.points !== this.props.points){
            this.setState({points: nextProps.points});
            this.setPosition(nextProps.points);
        }

    }

    setPosition(points) {
        const {polyline} = this.state;
        polyline.setLatLngs(points);
    }

    componentWillUnmount(){
        const{polyline} = this.state;
        polyline.remove()
    }

    render() {return null;}
}

_Polyline.contextTypes = {
    map: PropTypes.object
};

_Polyline.propTypes = {
    trackerState: PropTypes.object,
    points: PropTypes.array,
    opacity: PropTypes.number,
    fill: PropTypes.bool,
    color: PropTypes.string,
    weight: PropTypes.number,
    click: PropTypes.func,
};

export default _Polyline