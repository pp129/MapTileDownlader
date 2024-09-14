import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';
import params from '../src/utils/TileLayerCollection/param';

const tiles = params();

interface getTileOptions<T> {
  id: string;
  style: keyof (typeof tiles)[T];
  urlTemplate: string;
  group?: boolean;
}

export { getTileOptions };

declare module 'proj4';

declare global {
  interface Window {
    $message: MessageApiInjection;
    electron: any;
  }
}
