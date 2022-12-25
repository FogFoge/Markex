/**
 * 文件类
 */
export class FileInfo {
  filePath?: string
  fileName: string
  fileContent: string
  untitled: boolean
  modifier = ''
  constructor(path: string, content: string) {
    this.filePath = path
    this.fileName = path.replace(/\\/g, '/').split('/').reverse()[0]
    this.fileContent = content
    this.untitled = false
  }
}

export function createUntitledFile(name: string): FileInfo {
  return { fileName: name, fileContent: '', untitled: true, modifier: 'newFile' }
}
