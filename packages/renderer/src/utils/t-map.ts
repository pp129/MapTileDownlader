// 地图
import Map from 'ol/Map';
import View from 'ol/View';
import {
  defaults as defaultControls,
  Attribution,
  Rotate,
  ScaleLine,
  Zoom,
  ZoomSlider,
} from 'ol/control';
import { DragRotateAndZoom, defaults as defaultInteractions } from 'ol/interaction';
import TileLayerCollection from './TileLayerCollection/TileLayerCollection';
import { defaultMap } from './layer-list';
import VectorSource from 'ol/source/Vector';
import type { Layer } from 'ol/layer';
import { Vector as VectorLayer } from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import definedProjection from '/@/utils/projConvert';
import type MapBrowserEvent from 'ol/MapBrowserEvent';

class TMap {
  private map: any; // 地图对象
  private _vectorLayer: any; // 区域图层

  constructor(id: string) {
    this.createMap(id);
  }
  // 创建地图
  createMap(id: string) {
    // 初始化定义投影参数
    definedProjection();

    const map = new Map({
      target: id,
      view: new View({
        center: [108.5525, 34.3227],
        zoom: 5,
        constrainResolution: false,
        projection: 'EPSG:4326',
      }),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      controls: defaultControls().extend([
        new ZoomSlider(),
        new ScaleLine(),
        new Attribution(),
        new Zoom(),
        new Rotate(),
      ]),
    });
    // 添加区域图层
    const source = new VectorSource();
    this._vectorLayer = new VectorLayer({
      source,
      style: {
        'fill-color': 'rgba(6,168,249,0.1)',
        'stroke-color': 'rgba(6,168,249,1)',
        'stroke-width': 2,
      },
      zIndex: 9,
    });
    map.addLayer(this._vectorLayer);
    this.map = map;
    // 鼠标悬浮
    this.map.on('pointermove', (evt: MapBrowserEvent<PointerEvent>) => {
      const pixel = this.map.getEventPixel(evt.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);
      this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });
    this.switchBaseLayer(defaultMap());
  }
  // 获取地图对象
  getMap() {
    return this.map;
  }
  // 切换底图
  switchBaseLayer(param: any) {
    const methodName = 'get' + param.parent + 'TileLayer';
    const style = param.layer.value;
    const tiles = new TileLayerCollection();
    const baseLayer = tiles[methodName as keyof TileLayerCollection](param.parent + '-' + style, {
      style,
      ...param.layer.exteral,
    });
    baseLayer.set('base', true);
    baseLayer.setZIndex(0);
    const layers = this.map
      .getLayers()
      .getArray()
      .filter((x: Layer) => x.get('base'));
    if (layers && layers.length > 0) {
      layers.forEach((layer: Layer) => {
        this.map.removeLayer(layer);
      });
    }
    this.map.addLayer(baseLayer);
  }
  // 添加geojson至地图
  addGeometry(geojson: any) {
    this._vectorLayer.getSource().clear();
    const features = new GeoJSON().readFeatures(geojson);
    const featureGeometry = features[0].getGeometry();
    this._vectorLayer.getSource().addFeatures(features);
    this.map.getView().fit(featureGeometry, { nearest: true });
  }
  // 自动适应地图范围
  fitExtent() {
    this.map.fitExtent(this._vectorLayer.getExtent(), 0);
  }
  // 获取地图范围
  getMapViewExtent() {
    return this.map.getView().calculateExtent(this.map.getSize());
  }
}

export default TMap;
