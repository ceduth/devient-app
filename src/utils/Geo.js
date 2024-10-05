    import * as Geolocation from 'expo-location'
    import { EventRegister } from 'react-native-event-listeners';
    import { GoogleAddress, Place } from '@fleetbase/sdk';
    import { StoreLocation } from '@fleetbase/storefront';
    import { set, get } from './Storage';
    import { haversine } from './Calculate';
    import axios from 'axios';
    import config from 'config';

    const { GOOGLE_MAPS_KEY } = config;
    const { emit } = EventRegister;

    /**
     *  Utility class for performing calculations.
     *
     * @export
     * @class GeoUtil
     */
    export default class GeoUtil {
        /**
         * Creates a new google address instance.
         *
         * @static
         * @return {GoogleAddress}
         * @memberof GeoUtil
         */
        static createGoogleAddress() {
            return new GoogleAddress(...arguments);
        }

        /**
         * Reverse geocodes coordinates into a GoogleAddress instance, which
         * will resolve from a Promise.
         *
         * @static
         * @param {string|number} latitude
         * @param {string|number} longitude
         * @return {Promise}
         * @memberof GeoUtil
         */
        static geocode(latitude, longitude) {
            return new Promise((resolve) => {
                return axios({
                    method: 'get',
                    url: `https://maps.googleapis.com/maps/api/geocode/json`,
                    params: {
                        latlng: `${latitude},${longitude}`,
                        sensor: false,
                        language: 'en-US',
                        key: GOOGLE_MAPS_KEY,
                    },
                }).then((response) => {
                    const result = response.data.results[0];

                    if (!result) {
                        return resolve(null);
                    }

                    resolve(new GoogleAddress(result));
                });
            });
        }

        /**
         * Checks to see if device has geolocation permissions.
         *
         * @static
         * @return {Promise}
         * @memberof GeoUtil
         */
        static checkHasLocationPermission() {
            return new Promise(async(resolve) => {
                const { status } = await Location.requestForegroundPermissionsAsync();  
                resolve(status === 'granted');
            });
        }

        /**
         * If the correct permissions are set, will resolve the current location of device via Promise.
         * Any android phone that doesn't have Google Play Service (i.e. any phone in China) will not work 
         * https://github.com/michalchudziak/react-native-geolocation/issues/120#issuecomment-794975751
         * @static
         * @return {Promise}
         * @memberof GeoUtil
         */
        static async getCurrentLocation() {
            const hasLocationPermission = await checkHasLocationPermission();
            const lastLocation = get('location');
            console.log('XXXXXXXXXXXXXXXXXX hasLocationPermission=', hasLocationPermission, 'lastLocation=', lastLocation)

            if (hasLocationPermission) {
                return new Promise(async(resolve) => {
                    Geolocation.getCurrentPositionAsync()
                        .then((position) => {
                            console.log('XXXXXXXXXXXXXXXXXX Geolocation.getCurrentPosition => position=', position)
                            const { latitude, longitude } = position.coords;

                            // if a location is stored and user is not more then 5km in distance from previous stored location skip geocode
                            if (lastLocation && haversine([latitude, longitude], lastLocation.coordinates) > 5) {
                                resolve(lastLocation);
                            }

                            GeoUtil.geocode(latitude, longitude).then((googleAddress) => {
                                console.log('XXXXXXXXXXXXXXXXXX GeoUtil.geocode(latitude, longitude) => googleAddress=', googleAddress)

                                if (!googleAddress) {
                                    return resolve(position);
                                }

                                googleAddress.setAttribute('position', position);

                                // save last known location
                                set('location', googleAddress.all());
                                emit('location.updated', Place.fromGoogleAddress(googleAddress));

                                resolve(googleAddress.all());
                            });
                        })
                        .catch((error) => {
                            console.log('XXXXXXXXXXXXXXXXXX getCurrentLocation() error =>', error)
                            resolve(null);
                        },)
                });
            }
        }

        /**
         * Get the current stored location for device/user.
         *
         * @static
         * @return {object}
         * @memberof GeoUtil
         */
        static getLocation() {
            const location = get('location');

            if (!location) {
                return null;
            }

            return location;
        }

        /**
         * Get coordinates from different types of objects
         *
         * @static
         * @param {*} location
         * @return {*}
         * @memberof GeoUtil
         */
        static getCoordinates(location) {
            if (!location) {
                return [];
            }

            if (location instanceof Place) {
                if (!location?.coordinates) {
                    return [0, 0];
                }

                const [longitude, latitude] = location.coordinates;
                const coordinates = [latitude, longitude];

                return coordinates;
            }

            if (location instanceof StoreLocation) {
                const point = location.getAttribute('place.location');

                if (!point) {
                    return [0, 0];
                }

                const [longitude, latitude] = point.coordinates;
                const coordinates = [latitude, longitude];

                return coordinates;
            }

            if (isArray(location)) {
                return location;
            }

            if (typeof location === 'object' && location?.type === 'Point') {
                const [longitude, latitude] = location.coordinates;
                const coordinates = [latitude, longitude];

                return coordinates;
            }
        }

        /**
         * Get the distance between two locations.
         *
         * @static
         * @param {*} origin
         * @param {*} destination
         * @return {*}
         * @memberof GeoUtil
         */
        static getDistance(origin, destination) {
            const originCoordinates = GeoUtil.getCoordinates(origin);
            const destinationCoordinates = GeoUtil.getCoordinates(destination);

            return haversine(originCoordinates, destinationCoordinates);
        }
    }

    const checkHasLocationPermission = GeoUtil.checkHasLocationPermission;
    const geocode = GeoUtil.geocode;
    const getCurrentLocation = GeoUtil.getCurrentLocation;
    const getLocation = GeoUtil.getLocation;
    const getCoordinates = GeoUtil.getCoordinates;
    const getDistance = GeoUtil.getDistance;

    export { checkHasLocationPermission, geocode, getLocation, getCurrentLocation, getCoordinates, getDistance };
