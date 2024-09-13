// 地图
import { TileTMS, TileTMSList, TileTMSListMerge } from './tile-tms';
import TileBaidu, { TileBaiduList } from './tile-baidu';
import { getState } from './progress';
class FileSave {
  constructor(data: any) {
    // const projection = data.mapConfig.projection.code; // BAIDU,EPSG:4326,EPSG:3857
    const projection = data.mapConfig.projection.code; // BAIDU,EPSG:4326,EPSG:3857
    if (getState()) {
      window.$message.warning('下载任务执行中，请稍后..');
    }
    if (projection === 'BD:09') {
      this.downloadBaidu(data);
    } else {
      this.downloadTms(data);
    }
  }
  // 保存单张图片
  saveImage(param: any) {
    // const param = {
    //   url: 'https://map.geoq.cn/MapServer/tile/9/207/421',
    //   savePath: '',
    // };
    // console.log(param);
    window.electron.saveImage(param);
  }
  // 保存图片并合并
  saveImagesAndMerge(param: any) {
    // const param = {
    //   layers: [{url:'https://map.geoq.cn/MapServer/tile/9/207/421',isLabel: true}],
    //   savePath: '',
    // };
    window.electron.ipcRenderer.send('save-image-merge', param);
  }
  ensureDirSync(path: string) {
    window.electron.ensureDir(path);
  }
  downloadTms(data: any) {
    console.log('download', data.mapConfig);
    if (data.mapConfig.config.group) {
      if (data.mergeLayers) {
        new TileTMSListMerge(data, this.saveImagesAndMerge, this.ensureDirSync);
      } else {
        new TileTMSList(data, this.saveImage, this.ensureDirSync);
      }
    } else {
      new TileTMS(data, this.saveImage, this.ensureDirSync);
    }
  }
  downloadBaidu(data: any) {
    if (data.mapConfig.config.group) {
      new TileBaiduList(data, this.saveImage, this.ensureDirSync);
    } else {
      new TileBaidu(data, this.saveImage, this.ensureDirSync);
    }
  }
}

export default FileSave;
