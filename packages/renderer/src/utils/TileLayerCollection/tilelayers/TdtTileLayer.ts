import { Tile } from 'ol/layer';
import params from './../param';
import { XYZ } from 'ol/source';

class TDTTileLayer extends Tile {
  constructor(id, options = {}) {
    const style = options.style || 'Normal';
    const xyzOpt = {
      url: params().TDT[style].url,
      // projection: 'EPSG:3857',
      crossOrigin: 'anonymous',
    };
    options.urlTemplate = params().TDT[style].url;
    const tile = new XYZ(xyzOpt);
    const layerOpt = { ...options, source: tile };
    super(layerOpt);
  }
}

export default TDTTileLayer;
