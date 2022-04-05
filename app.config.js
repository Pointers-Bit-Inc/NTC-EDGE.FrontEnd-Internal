export default {
  "expo": {
    "name": "NTC-EDGE PORTAL",
    "slug": "ntc-edge-internal",
    "owner": "ntc-edge",
    "version": process.env.APP_VERSION ?? "1.0.4",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "backgroundColor": "#031A6E",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover",
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": false,
      "usesIcloudStorage": true,
      "bundleIdentifier": "com.ntcedge.portal",
      "buildNumber": process.env.APP_VERSION ?? "1.0.4",
      "infoPlist": {
        "NSCameraUsageDescription": "This will be used for video call and live streaming.",
        "NSMicrophoneUsageDescription": "This will be used for video call and live streaming.",
        "NSPhotoLibraryUsageDescription": "Allow $(PRODUCT_NAME) to access your photos",
        "NSLocationWhenInUseUsageDescription": "Allow $(PRODUCT_NAME) to access your location"
      }
    },
    "androidStatusBar": {
      "backgroundColor": '#031A6E',
      "translucent": false
    },
    "android": {
      "softwareKeyboardLayoutMode": "pan",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.ntcedge.portal",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-document-picker",
        {
          "appleTeamId": "4A3P2635GN"
        }
      ],
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow $(PRODUCT_NAME) to access your photos"
        }
      ]
    ],
    "extra": {
      "API_URL": process.env.API_URL,
      "API_VERSION": process.env.API_VERSION ?? '1.0',
      "oneSignalAppId": "3d463c09-c966-4423-9c49-9ea98d295058"
    }
  }
}
