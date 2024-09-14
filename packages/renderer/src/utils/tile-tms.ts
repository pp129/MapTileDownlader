// 瓦片转换
import { setState, setProgress, getState } from './progress';
import { downloadLoop } from './download';
import type BaseTileLayer from '/@/utils/TileLayerCollection/tilelayers/BaseTileLayer';
import { platform as platformName } from '#preload';

const slash = platformName === 'win32' ? '\\' : '/'; // 文件路径的斜杠

// 经纬度转瓦片行列号
function long2tile(lon: number, zoom: number) {
  return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
}

// 经纬度转瓦片行列号Google
// eslint-disable-next-line
function lat2tileGoogle(lat: number, zoom: number) {
  return Math.floor(
    ((1 -
      Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
      2) *
      Math.pow(2, zoom),
  );
}
// 经纬度转瓦片行列号TMS
// eslint-disable-next-line
function lat2tileTMS(lat: number, zoom: number) {
  return (
    (1 << zoom) -
    Math.floor(
      ((1 -
        Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) /
        2) *
        Math.pow(2, zoom),
    ) -
    1
  );
}
/**
 * 下载TMS瓦片
 */
export class TileTMS {
  private readonly apiDownload: (arg0: any) => void; // 下载函数
  private readonly rootPath: string; // 文件根目录
  private readonly maxZoom: number; // 最大缩放级别
  private readonly minZoom: number; // 最小缩放级别
  private mapExtent: any; // 下载范围
  private readonly urlTemplate: string; // 下载地址
  private readonly apiEnsureDirSync: (arg0: string) => void; // 创建文件夹
  private titleLayer: any; // 图层
  private list: any[] = []; // 瓦片列表
  constructor(data: any, apiDownload: (arg: any) => void, apiEnsureDirSync: (arg: string) => void) {
    this.apiDownload = apiDownload;
    this.rootPath = data.savePath; // 文件根目录
    this.maxZoom = data.maxZoom;
    this.minZoom = data.minZoom;
    this.mapExtent = data.extent;
    // this.projection = data.mapConfig.projection.code; // BAIDU,EPSG:4326,EPSG:3857
    this.urlTemplate = data.mapConfig.config.urlTemplate;
    this.apiEnsureDirSync = apiEnsureDirSync;
    this.titleLayer = data.mapConfig.titleLayer[0];
    setState(true);
    downloadLoop(this.calcTiles(), this.apiDownload);
  }
  calcTiles() {
    // 当前绝对路径
    const downloadPath = this.rootPath + slash;

    // 下载范围
    const zmin = this.minZoom;
    const zmax = this.maxZoom + 1;
    const south_edge = this.mapExtent.ymin;
    const north_edge = this.mapExtent.ymax;
    const west_edge = this.mapExtent.xmin;
    const east_edge = this.mapExtent.xmax;
    // 下载地址
    // const baseUrl = this.urlTemplate;
    const pictureType = '.png';
    // 遍历URL，获取数据
    const list = [];
    for (let z = zmin; z < zmax; z++) {
      const top_tile = lat2tileGoogle(north_edge, z);
      const left_tile = long2tile(west_edge, z);
      const bottom_tile = lat2tileGoogle(south_edge, z);
      const right_tile = long2tile(east_edge, z);
      const minLong = Math.min(left_tile, right_tile);
      const maxLong = Math.max(left_tile, right_tile);
      let minLat = Math.min(bottom_tile, top_tile);
      if (minLat < 0) minLat = 0;
      const maxLat = Math.max(bottom_tile, top_tile);
      for (let x = minLong; x <= maxLong; x++) {
        const temppath = downloadPath + z + slash + x;
        this.apiEnsureDirSync(temppath);
        for (let y = minLat; y <= maxLat; y++) {
          // const str3 = baseUrl
          //   .replace('{z}', z.toString())
          //   .replace('{x}', x.toString())
          //   .replace('{y}', y.toString());
          const str3 = this.titleLayer.getTileUrl(x, y, z);
          const path2 = temppath + slash + y + pictureType;
          list.push({ zoom: z, url: str3, savePath: path2 });
        }
      }
    }
    return list;
  }
}

/**
 * 下载TMS瓦片集合
 */
export class TileTMSList {
  list: any[] = [];
  rootPath: string;
  maxZoom: number;
  minZoom: number;
  mapExtent: any;
  apiDownload: (args: any) => void;
  apiEnsureDirSync: (arg0: string) => void;
  titleLayer: any;
  urlTemplate: string;
  constructor(data: any, apiDownload: (arg: any) => void, apiEnsureDirSync: (arg: string) => void) {
    this.apiDownload = apiDownload;
    this.rootPath = data.savePath; // 文件根目录
    this.maxZoom = data.maxZoom;
    this.minZoom = data.minZoom;
    this.mapExtent = data.extent;
    this.apiEnsureDirSync = apiEnsureDirSync;
    this.titleLayer = data.mapConfig.titleLayer;
    this.urlTemplate = data.mapConfig.config.urlTemplate;
    setState(true);

    let list: any[] = [];
    data.mapConfig.titleLayer.forEach((layer: BaseTileLayer) => {
      list = [...list, ...this.calcTiles(layer.getProperties().style, layer)];
    });
    downloadLoop(list, this.apiDownload);
  }
  calcTiles(subpath: string, layer: any) {
    // 当前绝对路径
    const downloadPath = this.rootPath + slash + subpath + slash;

    // 下载范围
    const zmin = this.minZoom;
    const zmax = this.maxZoom + 1;
    const south_edge = this.mapExtent.ymin;
    const north_edge = this.mapExtent.ymax;
    const west_edge = this.mapExtent.xmin;
    const east_edge = this.mapExtent.xmax;
    // 下载地址
    // const baseUrl = layer.getProperties().urlTemplate || this.urlTemplate;
    const pictureType = '.png';
    // 遍历URL，获取数据
    const list = [];
    for (let z = zmin; z < zmax; z++) {
      const top_tile = lat2tileGoogle(north_edge, z);
      const left_tile = long2tile(west_edge, z);
      const bottom_tile = lat2tileGoogle(south_edge, z);
      const right_tile = long2tile(east_edge, z);
      const minLong = Math.min(left_tile, right_tile);
      const maxLong = Math.max(left_tile, right_tile);
      let minLat = Math.min(bottom_tile, top_tile);
      if (minLat < 0) minLat = 0;
      const maxLat = Math.max(bottom_tile, top_tile);
      for (let x = minLong; x <= maxLong; x++) {
        const temppath = downloadPath + z + slash + x;
        this.apiEnsureDirSync(temppath);
        for (let y = minLat; y <= maxLat; y++) {
          // const str3 = baseUrl.replace('{z}', z).replace('{x}', x).replace('{y}', y);
          const str3 = layer.getTileUrl(x, y, z);
          const path2 = temppath + slash + y + pictureType;
          list.push({ zoom: z, url: str3, savePath: path2 });
        }
      }
    }
    return list;
  }
}

/**
 * 下载TMS瓦片集合，合并多张瓦片
 */
export class TileTMSListMerge {
  list: any[];
  rootPath: string;
  maxZoom: number;
  minZoom: number;
  mapExtent: any;
  titleLayer: any;
  apiDownload: (args: any) => void;
  apiEnsureDirSync: (args: string) => void;
  constructor(data: any, apiDownload: (arg: any) => void, apiEnsureDirSync: (arg: string) => void) {
    this.apiDownload = apiDownload;
    this.rootPath = data.savePath; // 文件根目录
    this.maxZoom = data.maxZoom;
    this.minZoom = data.minZoom;
    this.mapExtent = data.extent;
    this.apiEnsureDirSync = apiEnsureDirSync;
    this.titleLayer = data.mapConfig.titleLayer;
    setState(true);

    this.list = this.calcTiles(data.mapConfig.titleLayer);
    this.download();
  }
  calcTiles(layers: any[]) {
    // 当前绝对路径
    const downloadPath = this.rootPath + slash;

    // 下载范围
    const zmin = this.minZoom;
    const zmax = this.maxZoom + 1;
    const south_edge = this.mapExtent.ymin;
    const north_edge = this.mapExtent.ymax;
    const west_edge = this.mapExtent.xmin;
    const east_edge = this.mapExtent.xmax;
    // 下载地址
    const pictureType = '.png';
    // 遍历URL，获取数据
    const list = [];
    for (let z = zmin; z < zmax; z++) {
      const top_tile = lat2tileGoogle(north_edge, z);
      const left_tile = long2tile(west_edge, z);
      const bottom_tile = lat2tileGoogle(south_edge, z);
      const right_tile = long2tile(east_edge, z);
      const minLong = Math.min(left_tile, right_tile);
      const maxLong = Math.max(left_tile, right_tile);
      let minLat = Math.min(bottom_tile, top_tile);
      if (minLat < 0) minLat = 0;
      const maxLat = Math.max(bottom_tile, top_tile);
      for (let x = minLong; x <= maxLong; x++) {
        const temppath = downloadPath + z + slash + x;
        this.apiEnsureDirSync(temppath);
        for (let y = minLat; y <= maxLat; y++) {
          const str3 = layers.map(ll => {
            return { url: ll.getTileUrl(x, y, z), isLabel: ll.config().style.includes('_Label') };
          });
          const path2 = temppath + slash + y + pictureType;
          list.push({ zoom: z, layers: str3, savePath: path2 });
        }
      }
    }
    return list;
  }
  download() {
    let index = 0;
    const length = this.list.length;
    if (length === 0) return;
    const list = this.list;
    const apiDownload = this.apiDownload;
    const statistics = { success: 0, error: 0, percentage: 0, count: length };
    const download = () => {
      if (index >= length) {
        statistics.percentage = 100;
        setProgress(statistics);
        setState(false);
        window.$message.success(
          `下载完成。下载成功${statistics.success}，下载失败${statistics.error}`,
        );
        return;
      }
      const item = list[index];
      statistics.percentage = Number(((index / length) * 100).toFixed(2));
      apiDownload(item);
      index++;
    };
    download();
    window.electron.imageDownloadDone((state: any) => {
      if (!getState()) return;
      if (state.state === 'completed') {
        statistics.success++;
      } else {
        statistics.error++;
      }
      setProgress(statistics);
      download();
    });
  }
}
