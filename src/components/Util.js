/**
 * Created by dmitriy on 03.10.16.
 */
export function isInside(node, target) {
    for (; node != null; node = node.parentNode)
        if (node &&
            node.className &&
            node.className.includes &&
            node.className.includes(target)) return true;
    return false;
}

export function getInsideNode(node, target) {
    for (; node != null; node = node.parentNode) {
        if (node.className === target){
            return node;
        }
    }
    return null;
}

export const MAX_ZOOM = 17;
export const INITIAL_ZOOM = 4;
export const CENTERING_ZOOM = 15;
export const OPTIMAL_ZOOM = 14;
export const LINE_WIDTH = 3;
export const BLUE = '#0000FF';
export const CIRCLE_WEIGHT = 3;
export const CIRCLE_MIN_RADIUS = 5;
export const CIRCLE_MAX_RADIUS = 7;
export const CIRCLE_MIN_RADIUS_TAP = 7;
export const CIRCLE_MAX_RADIUS_TAP = 10;