import { dialog } from 'electron'
import { readFile } from 'fs/promises'
import { FileInfo } from '../interface'

export const fileUtils = {
  readFile: async (): Promise<FileInfo> => {
    const { canceled, filePaths } = await dialog.showOpenDialog({})
    let filePath = ''
    if (!canceled) filePath = filePaths[0]
    const data = await readFile(filePath)
    return new FileInfo(filePath, data.toString())
  }
}
