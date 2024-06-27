import {Tile} from 'ol/layer.js';
import { XYZ } from 'ol/source';
import params from './../param';
import {AMapMercatorProj} from '/@/utils/t-map';

class AmapTileLayer extends Tile {
    constructor(id:string, options = {}) {
      const style = options.style || 'Normal';
      const xyzOpt = {
        url: params().Amap[style].url,
        projection: AMapMercatorProj,
        crossOrigin: 'anonymous',
      };
      const tile = new XYZ(xyzOpt);
      const layerOpt = { ...options, ...{ source: tile } };
      super(layerOpt);
    }
}

export default AmapTileLayer;
