import { Song } from 'bemuse/collection-model/types'

export interface CustomFolderState {
  /**
   * The filesystem handle.
   */
  handle?: FileSystemDirectoryHandle

  /**
   * List of chart files
   */
  chartFiles?: CustomFolderChartFile[]
  chartFilesScanned?: boolean

  /**
   * Folders that needs updating.
   */
  foldersToUpdate?: CustomFolderFolderEntry[]

  /**
   * Folders that needs to be removed from the `songs`.
   */
  foldersToRemove?: CustomFolderFolderEntry[]

  /**
   * Songs found in the folder.
   */
  songs?: CustomFolderSong[]
}

export interface CustomFolderFolderEntry {
  path: string[]
}

export interface CustomFolderChartFile {
  path: string[]
  lastModified: number
}

export interface CustomFolderSong {
  path: string[]
  song: Song
}
