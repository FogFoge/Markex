const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  markdown: (content) => {
    return ipcRenderer.sendSync('change', content)
  },
  createWindow: () => {
    ipcRenderer.send('createWindow')
  },
  fileSave: async (data, filePath) => {
    return await ipcRenderer.invoke('fileSave', data, filePath)
  }
})
