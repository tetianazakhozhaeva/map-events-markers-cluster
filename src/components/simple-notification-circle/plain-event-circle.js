import React from 'react';
import {object} from 'prop-types'
import L from 'leaflet';

class PlainEventCircle extends React.Component{

    static contextTypes = {
        map: object
    };

    componentDidMount(){

        const {
            coordinate, opacity, fill,
            fillOpacity, fillColor, weight,
            color,
            radius,
            className
        } = this.props;


        let myRenderer = L.svg({ padding: 0.5 });

        const options = {
             opacity,
            fill,
            fillOpacity,
            fillColor,
            weight,
            radius,
            color,
            className,
            // renderer: myRenderer
        };




        this._leafletElement =  L.circleMarker(
            L.latLng(coordinate.latitude, coordinate.longitude),
            options
        );

        this._leafletElement.addTo(this.context.map);

        // if(this.props.className){
        //     this._leafletElement.className = this.props.className;
        // }


        this._leafletElement.bringToFront();

    }

    componentWillUnmount(){
        this._leafletElement.remove();
    }

    render(){
        return null;
    }
}

export default PlainEventCircle;
