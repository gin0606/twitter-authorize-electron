const electron = require('electron');

process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;

const menuTemplate = [
  {
    label: 'Edit',
    submenu: [
      { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' },
      { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut' },
      { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectall' },
    ],
  },
];
const menu = Menu.buildFromTemplate(menuTemplate);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
  });
  mainWindow.loadURL(`file://${__dirname}/index.html`);
  if (process.env.NODE_ENV !== 'production') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  Menu.setApplicationMenu(menu);
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
