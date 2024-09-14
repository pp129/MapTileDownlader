import BaseTileLayer from './BaseTileLayer';
import { XYZ } from 'ol/source';
import params from './../param';
import type { getTileOptions } from 'types/global';

class TencentTileLayer extends BaseTileLayer {
  options = {} as getTileOptions<'Tencent'>;
  constructor(id: string, options: getTileOptions<'Tencent'>) {
    const style = options.style || 'Normal';
    const xyzOpt = {
      crossOrigin: 'anonymous',
      tileUrlFunction: function (tileCoord: number[]) {
        if (!tileCoord) {
          return '';
        }
        const z = tileCoord[0];
        const x = tileCoord[1];
        // const y = -tileCoord[2] - 1;
        const y = Math.pow(2, z) - 1 - tileCoord[2];
        const m = Math.floor(x / 16.0);
        const n = Math.floor(y / 16.0);
        const urlTemplate = params().Tencent[style].url;
        return urlTemplate
          .replace('{x}', x.toString())
          .replace('{y}', y.toString())
          .replace('{z}', z.toString())
          .replace('{m}', m.toString())
          .replace('{n}', n.toString());
      },
    };
    options.id = id;
    options.urlTemplate = params().Tencent[style].url;
    const tile = new XYZ(xyzOpt);
    const layerOpt = { ...options, source: tile };
    super(layerOpt);
    this.options = options;
  }
  getTileUrl(x: number, y: number, z: number) {
    const urlArgs = this.getUrlArgs(x, y, z);
    const l = urlArgs.z;
    const r = urlArgs.x;
    const c = urlArgs.y;

    const m = Math.floor(r / 16.0);
    const n = Math.floor(c / 16.0);
    const urlTemplate = this.options['urlTemplate'];
    return urlTemplate
      .replace('{x}', r.toString())
      .replace('{y}', c.toString())
      .replace('{z}', l.toString())
      .replace('{m}', m.toString())
      .replace('{n}', n.toString());
  }

  getUrlArgs(x: number, y: number, z: number) {
    return {
      z: z,
      x: x,
      y: Math.pow(2, z) - 1 - y,
    };
  }
}

export default TencentTileLayer;
