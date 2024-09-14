import BaseTileLayer from './BaseTileLayer';
import { XYZ } from 'ol/source';
import TileGrid from 'ol/tilegrid/TileGrid';
import params from './../param';
import type { getTileOptions } from 'types/global';

class BaiduTileLayer extends BaseTileLayer {
  constructor(id: string, options: getTileOptions<'Baidu'>) {
    const style = options.style || 'Normal';
    // 计算百度使用的分辨率
    const resolutions = [];
    for (let i = 0; i < 19; i++) {
      resolutions[i] = Math.pow(2, 18 - i);
    }
    const tileGrid = new TileGrid({
      origin: [0, 0], // 设置原点坐标
      resolutions, // 设置分辨率
    });
    // 创建百度地图的数据源
    const xyzOpt = {
      projection: 'BD:09',
      tileGrid: tileGrid,
      tileUrlFunction: function (tileCoord: number[]) {
        if (!tileCoord) {
          return '';
        }
        const z = tileCoord[0];
        const x = tileCoord[1];
        const y = -tileCoord[2] - 1;
        const urlTemplate = params().Baidu[style].url;
        return urlTemplate
          .replace('{x}', x.toString())
          .replace('{y}', y.toString())
          .replace('{z}', z.toString());
      },
      crossOrigin: 'anonymous',
    };
    options.id = id;
    options.urlTemplate = params().Baidu[style].url;
    const tile = new XYZ(xyzOpt);
    // 百度地图层
    const layerOpt = { ...options, source: tile };
    super(layerOpt);
  }
}

export default BaiduTileLayer;
