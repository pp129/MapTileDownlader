import params from './../param';
import { Tile } from 'ol/layer';
import { XYZ } from 'ol/source';

class GeoqTileLayer extends Tile {
  constructor(id, options = {}) {
    const style = options.style || 'Colour';
    const xyzOpt = {
      url: params().GEOQ[style].url,
      // projection: 'EPSG:3857',
      crossOrigin: 'anonymous',
    };
    const tile = new XYZ(xyzOpt);
    const layerOpt = { ...options, ...{ source: tile } };
    super(layerOpt);
  }
}

export default GeoqTileLayer;
