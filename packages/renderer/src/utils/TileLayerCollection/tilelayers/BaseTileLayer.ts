import { Tile } from 'ol/layer';
import type { default as TileSourceType } from 'ol/source/Tile';
class BaseTileLayer extends Tile<TileSourceType> {
  // constructor(id, options) {
  //   super(id, options);
  // }
}

export default BaseTileLayer;
