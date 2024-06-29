import {Tile} from 'ol/layer';
import {XYZ} from 'ol/source';
import params from './../param';

class TencentTileLayer extends Tile {
    constructor(id:string, options = {}) {
      const style = options.style || 'Normal';
      const xyzOpt = {
        crossOrigin: 'anonymous',
        tileUrlFunction: function (tileCoord) {
          if (!tileCoord) {
            return '';
          }
          const z = tileCoord[0];
          const x = tileCoord[1];
          // const y = -tileCoord[2] - 1;
          const y = Math.pow(2, z) - 1 -tileCoord[2];
          const m = Math.floor(x / 16.0);
          const n = Math.floor(y / 16.0);
          const urlTemplate = params().Tencent[style].url;
          return urlTemplate.replace('{x}', x).replace('{y}', y).replace('{z}', z).replace('{m}', m).replace('{n}', n);
        },
      };
      options.urlTemplate = params().Tencent[style].url;
      const tile = new XYZ(xyzOpt);
      const layerOpt = { ...options, ...{ source: tile } };
      super(layerOpt);
    }
}

export default TencentTileLayer;
