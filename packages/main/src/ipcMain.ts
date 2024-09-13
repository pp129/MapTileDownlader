import { dialog, ipcMain } from 'electron';
import { requestHandle } from './ipHandle';
const fse = require('fs-extra');
const fs = require('fs');
const sharp = require('sharp');
const request = require('superagent');

async function handleFileOpen(properties: string[]) {
  return await dialog.showOpenDialog({
    properties: ['openDirectory', 'createDirectory'].concat(properties),
  });
}
ipcMain.handle('dialog:openFile', handleFileOpen);
ipcMain.handle('show-dialog', async () => {
  return await dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] });
});
// 确保目录存在，不存在则创建
ipcMain.on('ensure-dir', (event, args) => {
  fse.ensureDirSync(args);
});

function ipcHandle(win) {
  // superagent & sharp 下载图片
  ipcMain.on('save-image', (event, args) => {
    const sharpStream = sharp({
      failOnError: false,
    });
    const promises = [];
    promises.push(
      sharpStream
        // .ensureAlpha()
        .toFile(args.savePath),
    );
    // got.stream(args.url).pipe(sharpStream);
    // request.get(args.url).pipe(sharpStream);
    requestHandle(request.get(args.url)).pipe(sharpStream);
    Promise.all(promises)
      .then(() => {
        win.webContents.send('imageDownloadDone', {
          state: 'completed',
        });
      })
      .catch(() => {
        // console.error('Error processing files, let\'s clean it up', err);
        try {
          fs.unlinkSync(args.savePath);
        } catch (e) {
          console.error(e);
        }
        win.webContents.send('imageDownloadDone', {
          state: 'error',
        });
      });
  });

  // superagent & sharp 下载、合并图片
  ipcMain.on('save-image-merge', (event, args) => {
    try {
      let imgBack: any;
      const imgBuffer: any[] = [];
      args.layers.forEach(async (item: any, index: number) => {
        const sharpStream = sharp({
          failOnError: false,
        });
        request.get(item.url).pipe(sharpStream);
        const bff = await sharpStream.toBuffer();
        if (item.isLabel) {
          imgBack = bff;
        } else {
          imgBuffer.push(bff);
        }
        // 结束保存
        if (index === args.layers.length - 1) {
          sharp(imgBack)
            .composite(
              imgBuffer.map(input => {
                return { input, gravity: 'centre', blend: 'saturate' };
              }),
            )
            .toFile(args.savePath)
            .then(() => {
              win.webContents.send('imageDownloadDone', {
                state: 'completed',
              });
            })
            .catch(() => {
              try {
                fs.unlinkSync(args.savePath);
              } catch (e) {
                console.error(e);
              }
            });
        }
      });
    } catch {
      win.webContents.send('imageDownloadDone', {
        state: 'error',
      });
    }
  });
}

export default ipcHandle;
