import TdtTileLayer from './tilelayers/TdtTileLayer';
import GeoqTileLayer from './tilelayers/GeoqTileLayer';
import GoogleTileLayer from './tilelayers/GoogleTileLayer';
import AmapTileLayer from './tilelayers/AmapTileLayer';
import TencentTileLayer from './tilelayers/TencentTileLayer';
import OsmTileLayer from './tilelayers/OsmTileLayer';
import CartoDbTileLayer from './tilelayers/CartoDbTileLayer';
import MapboxTileLayer from './tilelayers/MapboxTileLayer';
import BaiduTileLayer from './tilelayers/BaiduTileLayer';
import { Group as LayerGroup } from 'ol/layer';
import Utils from './utils';
import type { getTileOptions } from 'types/global';

class TileLayerCollection {
  getTdtTileLayer(id: string, options: getTileOptions<'TDT'>) {
    const tileOptions: any = { ...options };
    const baseLayers = [];
    const baseLayer = new TdtTileLayer(Utils.uuid(), options);
    baseLayers.push(baseLayer);
    if (options.style) {
      tileOptions.style = options.style + '_Label';
      const baseLayer1 = new TdtTileLayer(Utils.uuid(), tileOptions);
      baseLayers.push(baseLayer1);
    }
    options.group = true;
    return new LayerGroup({
      layers: baseLayers,
      properties: options,
    });
  }

  getGeoqTileLayer(id: string, options: getTileOptions<'GEOQ'>) {
    const baseLayer = new GeoqTileLayer(id, options);
    return baseLayer;
  }

  getGoogleTileLayer(id: string, options: getTileOptions<'Google'>) {
    const baseLayer = new GoogleTileLayer(id, options);
    return baseLayer;
  }

  getAmapTileLayer(id: string, options: getTileOptions<'Amap'>) {
    const tileOptions: getTileOptions<'Amap'> = { ...options };
    if (options.style === 'Satellite') {
      const baseLayer = new AmapTileLayer(Utils.uuid(), options);
      tileOptions.style = 'Satellite_Label';
      const labelLayer = new AmapTileLayer(Utils.uuid(), tileOptions);
      options.group = true;
      return new LayerGroup({
        layers: [baseLayer, labelLayer],
        properties: options,
      });
    } else {
      return new AmapTileLayer(id, options);
    }
  }

  getTencentTileLayer(id: string, options: getTileOptions<'Tencent'>) {
    const tileOptions: any = { ...options };
    if (options.style === 'Normal') {
      options.group = false;
      return new TencentTileLayer(id, options);
    } else {
      const baseLayers = [];
      const baseLayer = new TencentTileLayer(Utils.uuid(), options);
      baseLayers.push(baseLayer);
      tileOptions.style = options.style + '_Label';
      const baseLayer1 = new TencentTileLayer(Utils.uuid(), tileOptions);
      baseLayers.push(baseLayer1);
      options.group = true;
      return new LayerGroup({
        layers: baseLayers,
        properties: options,
      });
    }
  }

  getOsmTileLayer(id: string, options: getTileOptions<'Osm'>) {
    return new OsmTileLayer(id, options);
  }

  getCartoDbTileLayer(id: string, options: getTileOptions<'CartoDb'>) {
    return new CartoDbTileLayer(id, options);
  }

  getMapboxTileLayer(id: string, options: getTileOptions<'Mapbox'>) {
    return new MapboxTileLayer(id, options);
  }

  getBaiduTileLayer(id: string, options: getTileOptions<'Baidu'>) {
    const tileOptions: any = { ...options };
    if (options.style === 'Satellite') {
      const baseLayers = [];
      const baseLayer = new BaiduTileLayer(Utils.uuid(), options);
      baseLayers.push(baseLayer);
      tileOptions.style = options.style + '_Label';
      const baseLayer1 = new BaiduTileLayer(Utils.uuid(), tileOptions);
      baseLayers.push(baseLayer1);
      options.group = true;
      return new LayerGroup({
        layers: baseLayers,
        properties: options,
      });
    } else {
      return new BaiduTileLayer(id, options);
    }
  }
}

export default TileLayerCollection;
