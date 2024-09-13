import {
  Projection,
  addEquivalentProjections,
  addEquivalentTransforms,
  addProjection,
  addCoordinateTransforms,
} from 'ol/proj';

import { PROJECTIONS as EPSG3857_PROJECTIONS } from 'ol/proj/epsg3857';
import { PROJECTIONS as EPSG4326_PROJECTIONS } from 'ol/proj/epsg4326';
import * as projZh from './transform';
import proj4 from 'proj4';

const definedProjection = () => {
  // constructor() {
  /**
   * register
   *
   * Make projections defined in proj4 (with proj4.defs()) available in OpenLayers. Requires proj4 >= 2.8.0.
   * This function should be called whenever changes are made to the proj4 registry, e.g. after calling proj4.defs(). Existing transforms will not be modified by this function.
   *
   * 需要同时使用@types/proj4与proj4两个依赖内容，@types/proj4不完整
   */

  // 注册自定义投影信息-版本引用存在问题 types版本2.5
  proj4.defs('EPSG:3395', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs');
  // console.log(proj4, proj4.version)
  // proj4.defs('EPSG:4490', '+proj=longlat +ellps=GRS80 +no_defs +type=crs');
  // register(proj4);

  // 高德坐标定义注册
  const gcj02mc = new Projection({
    code: 'GCJ:02',
    axisOrientation: 'enu',
    // transformFun 函数 transform(coordinate, source, destination)
    // extent: applyTransform([-180, -90, 180, 90], projZh.ll2gcj02mc),
    extent: [-20037508.342789244, -20037508.34278071, 20037508.342789244, 20037508.34278071],
    worldExtent: [-180, -85, 180, 85],
    global: true,
    units: 'm',
    getPointResolution: function (resolution, point) {
      return resolution / Math.cosh(point[1] / 6378137);
    },
  });
  // addProjection(gcj02mc);
  // // @ts-ignore
  // addCoordinateTransforms('EPSG:4326', gcj02mc, projZh.ll2gcj02mc, projZh.gcj02mc2ll);
  // // @ts-ignore
  // addCoordinateTransforms('EPSG:3857', gcj02mc, projZh.mc2gcj02mc, projZh.gcj02mc2mc);

  addEquivalentProjections([gcj02mc]);
  addEquivalentTransforms(EPSG4326_PROJECTIONS, [gcj02mc], projZh.ll2gcj02mc, projZh.gcj02mc2ll);
  addEquivalentTransforms(EPSG3857_PROJECTIONS, [gcj02mc], projZh.mc2gcj02mc, projZh.gcj02mc2mc);

  // 百度坐标定义注册  const RADIUS = 6378137;
  const baiduMercatorProj = new Projection({
    code: 'BD:09',
    axisOrientation: 'enu',
    // extent: applyTransform([72.004, 0.8293, 137.8347, 55.8271], projZh.ll2bmerc),
    extent: [-33554432, -33554432, 33554432, 33554432],
    worldExtent: [-180, -85, 180, 85],
    global: true,
    units: 'm',
    getPointResolution: function (resolution, point) {
      return resolution / Math.cosh(point[1] / 6378137);
    },
  });
  addEquivalentProjections([baiduMercatorProj]);
  addEquivalentTransforms(
    EPSG4326_PROJECTIONS,
    [baiduMercatorProj],
    projZh.ll2bmerc,
    projZh.bmerc2ll,
  );
  addEquivalentTransforms(
    EPSG3857_PROJECTIONS,
    [baiduMercatorProj],
    projZh.smerc2bmerc,
    projZh.bmerc2smerc,
  );

  // addProjection(baiduMercatorProj);
  // // @ts-ignore
  // addCoordinateTransforms('EPSG:4326', baiduMercatorProj, projZh.ll2bmerc, projZh.bmerc2ll);
  // // @ts-ignore
  // addCoordinateTransforms('EPSG:3857', baiduMercatorProj, projZh.smerc2bmerc, projZh.bmerc2smerc);

  // 新增兼容海图3395左边系数据 - register没有生成投影注册
  const projection3395 = new Projection({
    code: 'EPSG:3395',
    extent: [-20037508.342789244, -20037508.342789244, 20037508.342789244, 20037508.342789244],
    worldExtent: [-180, -80, 180, 84],
    global: true,
    units: 'm',
    axisOrientation: 'neu',
  });
  addProjection(projection3395);
  addCoordinateTransforms(
    'EPSG:4326',
    'EPSG:3395',
    function (coordinate) {
      return proj4('EPSG:4326', 'EPSG:3395', coordinate);
    },
    function (coordinate) {
      return proj4('EPSG:3395', 'EPSG:4326', coordinate);
    },
  );
  addCoordinateTransforms(
    'EPSG:3857',
    'EPSG:3395',
    function (coordinate) {
      return proj4('EPSG:3857', 'EPSG:3395', coordinate);
    },
    function (coordinate) {
      return proj4('EPSG:3395', 'EPSG:3857', coordinate);
    },
  );

  // 扩展海图与第三方电子底图的投影转换【百度|高德】
  addCoordinateTransforms(
    'GCJ:02',
    'EPSG:3395',
    function (coordinate) {
      const coord = projZh.gcj02mc2mc(coordinate, coordinate, undefined);
      return proj4('EPSG:3857', 'EPSG:3395', coord);
    },
    function (coordinate) {
      const coord = proj4('EPSG:3395', 'EPSG:3857', coordinate);
      return projZh.mc2gcj02mc(coord, coord, undefined);
    },
  );
  addCoordinateTransforms(
    'BD:09',
    'EPSG:3395',
    function (coordinate) {
      const coord = projZh.bmerc2smerc(coordinate, coordinate, undefined);
      return proj4('EPSG:3857', 'EPSG:3395', coord);
    },
    function (coordinate) {
      const coord = proj4('EPSG:3395', 'EPSG:3857', coordinate);
      return projZh.smerc2bmerc(coord, coord, undefined);
    },
  );

  // 第三方图层定义内容转换
  addEquivalentTransforms(
    [baiduMercatorProj],
    [gcj02mc],
    projZh.bmerc2gcj02mc,
    projZh.gcj02mc2bmerc,
  );

  addEquivalentTransforms(
    [gcj02mc],
    [baiduMercatorProj],
    projZh.gcj02mc2bmerc,
    projZh.bmerc2gcj02mc,
  );
  // }
};

export default definedProjection;
