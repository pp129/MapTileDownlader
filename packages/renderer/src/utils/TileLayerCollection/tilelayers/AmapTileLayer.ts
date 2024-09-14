import BaseTileLayer from './BaseTileLayer';
import { XYZ } from 'ol/source';
import params from './../param';
import type { getTileOptions } from 'types/global';

class AmapTileLayer extends BaseTileLayer {
  options = {} as getTileOptions<'Amap'>;
  constructor(id: string, options: getTileOptions<'Amap'>) {
    const style = options.style || 'Normal';
    const xyzOpt = {
      url: params().Amap[style].url,
      projection: 'GCJ:02',
      crossOrigin: 'anonymous',
    };
    options.id = id;
    options.urlTemplate = params().Amap[style].url;
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
    console.log(this.options);
    const urlTemplate = this.options['urlTemplate'];
    return urlTemplate
      .replace('{x}', r.toString())
      .replace('{y}', c.toString())
      .replace('{z}', l.toString());
  }
  getUrlArgs(x: number, y: number, z: number) {
    return {
      z: z,
      x: x,
      y: y,
    };
  }
}

export default AmapTileLayer;
