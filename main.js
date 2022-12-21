const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");

const hljs = require('highlight.js');
const md = require("markdown-it")({
  html: true,
  xhtmlOut: true,
  linkify: true,
  typographer: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return "";
  },
});
md.linkify.tlds('.py', false)
          .tlds('.cpp', false);


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      spellcheck: false,
      devTools: false
    },
  });
  mainWindow.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.on('change', (event, content) => {
  event.returnValue = md.render(content)
});

ipcMain.on('createWindow', () => {
  createWindow();
});

ipcMain.handle('fileSave', async (_event, data, curPath) => {
  if (curPath) {
    await fs.writeFile(curPath, data, () => {});
    return curPath;
  }
  else {
    const { canceled, filePath } = await dialog.showSaveDialog({});
    if (!canceled) {
      console.log(filePath);
      console.log(data);
      await fs.writeFile(filePath, data, () => {});
    }
    return filePath;
  }
});