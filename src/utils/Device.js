/**
 * Expo Device extension
 * A universal library provides access to system information about the physical device.
 * https://docs.expo.dev/versions/latest/sdk/device/
 * 
 */
import * as Application from 'expo-application';
import { Platform } from 'expo-modules-core';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import * as Device from 'expo-device';


/**
 * Expo get unique device id without ejecting
 * https://stackoverflow.com/a/71305727/4615806
 * @returns 
 */
const getDeviceId = async () => {
  if (Platform.OS === 'android') {
    return Application.androidId;
  } else {
    let deviceId = await SecureStore.getItemAsync('deviceId');

    if (!deviceId) {
      deviceId = Constants.deviceId; //or generate uuid
      await SecureStore.setItemAsync('deviceId', deviceId);
    }

    return deviceId;
  }
}

export { getDeviceId, Device }