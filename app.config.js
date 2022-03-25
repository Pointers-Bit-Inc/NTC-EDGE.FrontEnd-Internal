export default {
  "expo": {
    "name": "ntc-edge-internal",
    "slug": "ntc-edge-internal",
    "owner": "ntc-edge",
    "version": "1.0.2",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover"
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
      "API_URL": process.env.API_URL
    }
  }
}
