import { IpcRenderer, IpcRendererEvent, contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  markdown: (content: string): string => {
    return ipcRenderer.sendSync('editor:render', content)
  },
  onEventRegister: (
    eventName: string,
    callback: (event: IpcRendererEvent, ...args: unknown[]) => void
  ): IpcRenderer => ipcRenderer.on(eventName, callback)
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
