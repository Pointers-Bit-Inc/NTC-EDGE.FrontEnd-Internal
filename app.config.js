export default {
  "expo": {
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
        "NSLocationWhenInUseUsageDescription": "Allow $(PRODUCT_NAME) to access your location for notification purposes."
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
      "build": {
        "babel": {
          "include": [
            "-",
            "@ant-design/react-native",
            "@microsoft/signalr",
            "@typescript-eslint/eslint-plugin",
            "agora",
            "agora-rtc-react",
            "agora-rtc-sdk",
            "axios",
            "dayjs",
            "eslint-config-airbnb-typescript",
            "eslint-config-prettier",
            "eslint-plugin-import",
            "eslint-plugin-jsx-a11y",
            "eslint-plugin-react",
            "fbjs",
            "immutable",
            "lodash",
            "moment",
            "native",
            "normalizr",
            "permissions",
            "prettier",
            "react",
            "react-dom",
            "react-redux",
            "react-responsive",
            "react-scroll-paged-view",
            "react-timer-mixin",
            "react-underline-tabbar",
            "redux",
            "redux-persist",
            "redux-thunk",
            "styled-components"
          ]
        }
      }
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
      "API_URL": process.env.API_URL,
      "API_VERSION": process.env.API_VERSION ?? '1.0',
      "oneSignalAppId": "3d463c09-c966-4423-9c49-9ea98d295058"
    }
  }
}
