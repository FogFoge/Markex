import { BrowserWindow } from 'electron'
import { fileUtils } from '../utils'

export const mainEvent = {
  fileOpen: async (window: BrowserWindow): Promise<void> => {
    const file = await fileUtils.readFile()
    window.webContents.send('file:openFile', file)
  },
  fileSavePre: async (window: BrowserWindow): Promise<void> => {
    window.webContents.send('file:saveFile:pre')
  }
}
