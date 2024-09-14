import BaseTileLayer from './BaseTileLayer';
import { XYZ } from 'ol/source';
import type { getTileOptions } from 'types/global';
import params from './../param';

class CartoDbTileLayer extends BaseTileLayer {
  options = {} as getTileOptions<'CartoDb'>;
  constructor(id: string, options: getTileOptions<'CartoDb'>) {
    const style = options.style || 'light';
    const xyzOpt = {
      url: params().CartoDb[style].url,
      // projection: 'EPSG:3857',
      crossOrigin: 'anonymous',
    };
    options.id = id;
    options.urlTemplate = params().CartoDb[style].url;
    const tile = new XYZ(xyzOpt);
    const layerOpt = { ...options, ...{ source: tile } };
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

export default CartoDbTileLayer;
