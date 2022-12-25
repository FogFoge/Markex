import { writable } from 'svelte/store'
import type { FileInfo } from '../../main/interface'

export const activeFile = writable<FileInfo>()
export const fileList = writable<Array<FileInfo>>([])
