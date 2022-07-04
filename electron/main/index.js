'use strict';

import { app, BrowserWindow } from 'electron';
import * as path from 'path';

const webOptions = {
  titleBarStyle: 'hidden',
  backgroundColor: '#031A6E',
  show: false,
  icon: path.join(__dirname, '../../assets/electron.png'),
  webPreferences: {
    devTools: false,
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true,
  }
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow;

function createMainWindow() {
  const browserWindow = new BrowserWindow(webOptions);
  // In this example, only windows with the `about:blank` url will be created.
  // All other urls will be blocked.
  browserWindow.webContents.setWindowOpenHandler(({ url }) => {
    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        ...webOptions,
        show: true
      }
    }
  })

  browserWindow.loadURL('https://ntcedge.com/');
  
  browserWindow.on('closed', () => {
    mainWindow = null;
  });

  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })

  return browserWindow;
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  mainWindow = createMainWindow();
});
