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

class TMap {
  private map: any;
  private _vectorLayer: any;

  constructor(id: string) {
    this.createMap(id);
  }
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
    const source = new VectorSource();
    this._vectorLayer = new VectorLayer({
      source,
      style: {
        'fill-color': 'rgba(255, 255, 255, 0.6)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33',
      },
      zIndex: 9,
    });
    map.addLayer(this._vectorLayer);
    this.map = map;
    // 鼠标悬浮
    this.map.on('pointermove', (evt: PointerEvent) => {
      const pixel = this.map.getEventPixel(evt.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);
      this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });
    this.switchBaseLayer(defaultMap());
  }
  getMap() {
    return this.map;
  }
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
    console.log(baseLayer.getProperties());
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
  // 绘制矩形、编辑矩形位置
  startDraw() {}
  getDrawLayer() {
    return this._vectorLayer;
  }
  // 结束绘制
  endDraw() {}
  // 获取下载范围
  getDownloadExtent() {
    if (!this._vectorLayer) return null;
    return this._vectorLayer.getExtent();
  }
  // 获取瓦片图层参数
  getBaseMapConfig() {}
  // 添加geojson至地图
  addGeometry(geojson) {
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

  getMapViewExtent() {
    return this.map.getView().calculateExtent(this.map.getSize());
    // return this._vectorLayer.getExtent();
  }
}

export default TMap;
