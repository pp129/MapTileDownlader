// 地图
import Map from 'ol/Map';
import View from 'ol/View';
import {defaults as defaultControls, Attribution, Rotate, ScaleLine, Zoom, ZoomSlider} from 'ol/control';
import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from 'ol/interaction';
import TileLayerCollection from './TileLayerCollection/TileLayerCollection';
import {defaultMap} from './layer-list';
import VectorSource from 'ol/source/Vector';
import {Vector as VectorLayer} from 'ol/layer';
import GeoJSON from 'ol/format/GeoJSON';
import { addCoordinateTransforms, addProjection, Projection, transform } from 'ol/proj';
import { applyTransform} from 'ol/extent';
import projzh from '/@/utils/projConvert';

/**
 * @Describe-注册百度坐标系
 */
const baiduMercatorProj = new Projection({
  code: 'baidu',
  // extent: applyTransform(extent, projzh.ll2bmerc),
  units: 'm',
});
const BDProj = new Projection({
  code: 'BD09',
  extent: applyTransform([-180, -90, 180, 90], projzh.ll2bmerc),
  units: 'm',
});
addProjection(baiduMercatorProj);
addProjection(BDProj);
addCoordinateTransforms('EPSG:4326', baiduMercatorProj, projzh.ll2bmerc, projzh.bmerc2ll);
addCoordinateTransforms('EPSG:4326', BDProj, projzh.ll2bmerc, projzh.bmerc2ll);
addCoordinateTransforms('EPSG:3857', baiduMercatorProj, projzh.smerc2bmerc, projzh.bmerc2smerc);
addCoordinateTransforms('EPSG:3857', BDProj, projzh.smerc2bmerc, projzh.bmerc2smerc);

/**
 * @Describe-注册高德坐标系
 */
export const AMapMercatorProj = new Projection({
  code: 'GCJ02',
  extent: applyTransform([-180, -90, 180, 90], projzh.ll2gcj02mc),
  units: 'm',
});
addProjection(AMapMercatorProj);
addCoordinateTransforms('EPSG:4326', AMapMercatorProj, projzh.ll2gcj02mc, projzh.gcj02mc2ll);
addCoordinateTransforms('EPSG:3857', AMapMercatorProj, projzh.mc2gcj02mc, projzh.gcj02mc2mc);

class TMap{
  private map: any;
  private _vectorLayer: any;

  constructor(id:string) {

    this.createMap(id);
  }
  createMap(id:string) {
    const map = new Map({
      target: id,
      view:new View({
        center: [108.5525, 34.3227],
        zoom: 5,
        constrainResolution: false,
        projection: 'EPSG:4326',
      }),
      interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
      controls: defaultControls().extend([
        new ZoomSlider(),
        new ScaleLine(),
        new Attribution,
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
    this.map.on('pointermove', evt => {
      const pixel = this.map.getEventPixel(evt.originalEvent);
      const hit = this.map.hasFeatureAtPixel(pixel);
      this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });
    this.switchBaseLayer(defaultMap());
  }
  getMap() {
    return this.map;
  }
  // 显示瓦片网格
  showTileGrid(val) {
    const baseLayer = this.map.getBaseLayer();
    baseLayer.config({debug: val});
    baseLayer.hide();
    baseLayer.show();
  }
  switchBaseLayer(param:any) {
    const methodName = 'get' + param.parent + 'TileLayer';
    const style = param.layer.value;
    const baseLayer = TileLayerCollection[methodName](param.parent + '-' + style, {
      style,
      ...param.layer.exteral,
    });
    baseLayer.set('base', true);
    baseLayer.setZIndex(0);
    console.log(baseLayer.getProperties());
    const layers = this.map.getLayers().getArray().filter(x => x.get('base'));
    if (layers && layers.length > 0) {
      layers.forEach(layer=>{
        this.map.removeLayer(layer);
      });
    }
    this.map.addLayer(baseLayer);
  }
  // 绘制矩形、编辑矩形位置
  startDraw() {
    const map = this.map;
    const isFirst = typeof this._drawTool === 'undefined';
    if (isFirst) {
      const layer = this._vectorLayer;
      const drawTool = new maptalks.DrawTool({
        mode: 'Rectangle',
        symbol : {
          lineColor: '#34495e',
          lineWidth: 2,
          polygonFill: 'rgb(135,196,240)',
          polygonOpacity: 0.6,
        },
      }).addTo(map).enable();
      this._drawTool = drawTool;
      // eslint-disable-next-line
      drawTool.on('drawstart', function (param) {
        layer.clear();
      });
      drawTool.on('drawend', function (param) {
        layer.addGeometry(param.geometry);
      });
    } else {
      const drawTool = this._drawTool;
      drawTool.enable();
    }
    this.map.setCursor('crosshair');
  }
  getDrawLayer() {
    return this._vectorLayer;
  }
  // 结束绘制
  endDraw() {
    if (this._vectorLayer) {
      this._vectorLayer.clear();
      this._drawTool?.disable();
      this.map.resetCursor();
    }
  }
  // 获取下载范围
  getDownloadExtent() {
    if (!this._vectorLayer) return null;
    return this._vectorLayer.getExtent();
  }
  // 获取瓦片图层参数
  getBaseMapConfig() {
    const baseMap = this.map.getBaseLayer();
    if (baseMap instanceof maptalks.GroupTileLayer) {
      const layers = baseMap.layers;
      return {
        config: layers.map(temp => {return temp.config();}),
        projection: baseMap.getProjection(),
        titleLayer: layers,
      };
    } else {
      return {
        config: baseMap.config(),
        projection: baseMap.getProjection(),
        titleLayer: baseMap,
      };
    }
  }
  // 添加geojson至地图
  addGeometry(geojson:any) {
    this._vectorLayer.getSource().clear();
    const features = new GeoJSON().readFeatures(geojson);
    const featureGeometry = features[0].getGeometry();
    this._vectorLayer.getSource().addFeatures(features);
    this.map.getView().fit(featureGeometry,{nearest:true});
  }
  // 自动适应地图范围
  fitExtent() {
    this.map.fitExtent(this._vectorLayer.getExtent(), 0);
  }

  getMapViewExtent(){
    return this.map.getView().calculateExtent(this.map.getSize());
    // return this._vectorLayer.getExtent();
  }
}

export default TMap;
