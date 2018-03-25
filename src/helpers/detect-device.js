const MobileDetect = require('mobile-detect');
let md = new MobileDetect(window.navigator.userAgent);

export const TABLET = "TABLET";
export const PHONE = "PHONE";
export const DESKTOP = "DESKTOP";

export function getDeviceType() {

    if(md.mobile()){
        if(md.tablet()){
            return TABLET;
        } else if(md.phone()){
            return PHONE;
        }
    } else {
        return DESKTOP;
    }
}
