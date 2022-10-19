export default {
  "expo": {
    "scheme": "portalapp.ntcedge.com",
    "name": "NTC-EDGE PORTAL",
    "slug": "ntc-edge-internal",
    "owner": "ntc-edge",
    "version": process.env.APP_VERSION ?? "1.0.4",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "cover",
    },
    "updates": {
      "enabled": false,
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": true,
      "usesIcloudStorage": true,
      "bundleIdentifier": "portalapp.ntcedge.com",
      "buildNumber": process.env.APP_VERSION ?? "1.0.4",
      "infoPlist": {
        "NSCameraUsageDescription": "Allow $(PRODUCT_NAME) to access your camera. This lets you take pictures and recording videos.",
        "NSMicrophoneUsageDescription": "Allow $(PRODUCT_NAME) to access your microphone. This lets you make voice, video calls and more.",
        "NSPhotoLibraryUsageDescription": "Allow $(PRODUCT_NAME) to access your photos to upload photos from your library. This also lets you save photos to your library.",
        "NSLocationWhenInUseUsageDescription": "Allow $(PRODUCT_NAME) to access your location for notification purposes.",
        "NSFaceIDUsageDescription": "Enabling Face ID allows you quick and secure access to your account."
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
      "package": "portalapp.ntcedge.com",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/favicon.png",
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
          "photosPermission": "Allow $(PRODUCT_NAME) to access your photos to upload photos from your library. This also lets you save photos to your library."
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "d382b208-6db4-4d0b-b4e8-4d0cacd5a1d4"
      },
      "API_URL": process.env.API_URL,
      "API_VERSION": process.env.API_VERSION ?? '1.0',
      "oneSignalAppId": "3d463c09-c966-4423-9c49-9ea98d295058"
    }
  }
}
