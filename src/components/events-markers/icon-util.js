import L from 'leaflet';

export const getDivIcon = (innerContent, size) => {
    return L.divIcon({
        iconSize: new L.Point(size, size),
        html: innerContent
    });
};
