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
            "@expo-google-fonts/poppins",
            "@expo/vector-icons",
            "@expo/webpack-config",
            "@microsoft/signalr",
            "@react-native-async-storage/async-storage",
            "@react-native-community/datetimepicker",
            "@react-native-picker/picker",
            "@react-navigation/bottom-tabs",
            "@react-navigation/drawer",
            "@react-navigation/material-top-tabs",
            "@react-navigation/native",
            "@react-navigation/native-stack",
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
            "expo",
            "expo-av",
            "expo-barcode-scanner",
            "expo-checkbox",
            "expo-constants",
            "expo-dev-client",
            "expo-document-picker",
            "expo-font",
            "expo-image-picker",
            "expo-keep-awake",
            "expo-permissions",
            "expo-progress",
            "expo-screen-orientation",
            "expo-splash-screen",
            "expo-status-bar",
            "expo-updates",
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
            "react-native",
            "react-native-agora",
            "react-native-animated-image-viewer",
            "react-native-app-intro-slider",
            "react-native-awesome-alerts",
            "react-native-barcode-mask",
            "react-native-blob-util",
            "react-native-camera",
            "react-native-chart-kit",
            "react-native-collapsible",
            "react-native-device-info",
            "react-native-element-dropdown",
            "react-native-exit-app",
            "react-native-file-viewer",
            "react-native-fs",
            "react-native-gesture-handler",
            "react-native-image-pan-zoom",
            "react-native-media-query",
            "react-native-modal",
            "react-native-modal-datetime-picker",
            "react-native-onesignal",
            "react-native-pager-view",
            "react-native-pdf",
            "react-native-permissions",
            "react-native-picker-select",
            "react-native-popup-menu",
            "react-native-progress",
            "react-native-progress-steps",
            "react-native-qrcode-scanner",
            "react-native-reanimated",
            "react-native-redash",
            "react-native-responsive-fontsize",
            "react-native-responsive-screen",
            "react-native-safe-area-context",
            "react-native-screens",
            "react-native-svg",
            "react-native-tab-view",
            "react-native-uuid",
            "react-native-web",
            "react-native-web-hooks",
            "react-native-webview",
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
