import BaseTileLayer from './BaseTileLayer';
import params from './../param';
import { XYZ } from 'ol/source';
import type { getTileOptions } from 'types/global';

class OsmTileLayer extends BaseTileLayer {
  options = {} as getTileOptions<'Osm'>;
  constructor(id: string, options: getTileOptions<'Osm'>) {
    const style = options.style || 'Normal';
    const xyzOpt = {
      url: params().Osm[style].url,
      // projection: 'EPSG:3857',
      crossOrigin: 'anonymous',
    };
    options.id = id;
    options.urlTemplate = params().Osm[style].url;
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

export default OsmTileLayer;