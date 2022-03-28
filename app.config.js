import {primaryColor} from "@styles/color";

export default {
  "expo": {
    "backgroundColor": "#1a202c",
    "name": "ntc-edge-internal",
    "slug": "ntc-edge-internal",
    "owner": "ntc-edge",
    "version": "1.0.2",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover",
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "ios": {
      "supportsTablet": true,
      "usesIcloudStorage": true,
      "bundleIdentifier": "com.ntcedge.portal",
      "buildNumber": "1.0.0",
      "infoPlist": {
        "NSCameraUsageDescription": "This will be used for video call and live streaming.",
        "NSMicrophoneUsageDescription": "This will be used for video call and live streaming."
      }
    },
    "androidStatusBar": {
      
      "backgroundColor": '#031A6E',
      "translucent": false
    },
    "android": {
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
