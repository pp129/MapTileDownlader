/**
 * @module preload
 */
import { contextBridge, ipcRenderer } from 'electron';

const apiKey = 'electron';
let imageDownloadhandle: any;
ipcRenderer.on('imageDownloadDone', (event, state) => {
  imageDownloadhandle && imageDownloadhandle(state);
});
/**
 * @see https://github.com/electron/electron/issues/21437#issuecomment-573522360
 */
const api = {
  versions: process.versions,
  ipcRenderer: { ...ipcRenderer },
  imageDownloadDone: (callback: any) => {
    imageDownloadhandle = callback;
  },
  'show-dialog': () => ipcRenderer.invoke('show-dialog'),
  openFile: () => ipcRenderer.invoke('dialog:openFile'),
  ensureDir: path => ipcRenderer.send('ensure-dir', path),
  saveImage: params => ipcRenderer.send('save-image', params),
};

/**
 * The "Main World" is the JavaScript context that your main renderer code runs in.
 * By default, the page you load in your renderer executes code in this world.
 *
 * @see https://www.electronjs.org/docs/api/context-bridge
 */
contextBridge.exposeInMainWorld(apiKey, api);

import { sha256sum } from './nodeCrypto';
import { versions } from './versions';
export { sha256sum, versions };
