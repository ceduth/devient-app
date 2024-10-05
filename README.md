

## Native Modules

Yes, Expo can support native code.
Yes. Expo dev client builds can support custom native code.
Expo Go can not support custom native code.

## Dev

```shell
```

```shell
yarn expo run:android
```

2. Create development build on an Android or an iOS device

```shell
npx expo install expo-dev-client
eas build --profile development --platform android
```

## FIXES


* Deleted [deprecated](https://stackoverflow.com/a/65237870/4615806) `navigator.geolocation`
* Deleted `import Config from 'react-native-config';`
* Replaced 'react-native-device-info' with `expo-device` + `expo-secure-store` customization

* Replace `react-native-image-picker` with `expo-image-picker` from `src/interface/PhotoUpload.js`
  https://docs.expo.dev/versions/latest/sdk/imagepicker/
  https://www.npmjs.com/package/react-native-image-picker#the-response-object
  https://dev.to/aaronksaunders/react-native-expo-image-picker-and-firebase-file-upload-2lg8
  https://snyk.io/advisor/npm-package/expo-image-picker/functions/expo-image-picker.launchImageLibraryAsync
  

## TODO

*  react-native-mmkv-storage does not work with Expo Go
  [issue](https://github.com/ammarahm-ed/react-native-mmkv-storage/issues/225)