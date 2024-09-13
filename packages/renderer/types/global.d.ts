import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider';

export {};

declare module 'proj4';

declare global {
  interface Window {
    $message: MessageApiInjection;
    electron: any;
  }
}
