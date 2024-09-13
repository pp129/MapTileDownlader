// 地图列表
import { nanoid } from 'nanoid';

const BaiduConstomSubdomains = [0, 1, 2]; // 百度自定义瓦片子域名
interface typeMapList {
  label: string;
  value: string;
  projection?: string;
  exteral?: any;
  uuid?: string;
  pid?: string;
  children?: typeMapList[];
}
const mapList: typeMapList[] = [
  {
    label: '高德',
    value: 'Amap',
    children: [
      {
        label: '电子地图',
        value: 'Normal',
        projection: 'EPSG:3857',
        exteral: {
          attribution: '高德-电子地图',
        },
      },
      {
        label: '卫星地图',
        value: 'Satellite',
        projection: 'EPSG:3857',
        exteral: {
          attribution: '高德-卫星地图',
        },
      },
    ],
  },
  {
    label: '百度',
    value: 'Baidu',
    children: [
      {
        label: '电子地图',
        value: 'Normal',
        projection: 'BD:09',
        exteral: {
          subdomains: [0, 1, 2, 3],
          attribution: '百度-电子地图',
        },
      },
      {
        label: '卫星地图',
        value: 'Satellite',
        projection: 'BD:09',
        exteral: {
          subdomains: [0, 1, 2, 3],
          attribution: '百度-卫星地图',
        },
      },
      {
        label: '午夜蓝',
        value: 'midnight',
        projection: 'BD:09',
        exteral: {
          subdomains: BaiduConstomSubdomains,
          attribution: '百度-自定义-午夜蓝',
        },
      },
      {
        label: '清新蓝',
        value: 'light',
        projection: 'BD:09',
        exteral: {
          subdomains: BaiduConstomSubdomains,
          attribution: '百度-自定义-清新蓝',
        },
      },
      {
        label: '黑夜',
        value: 'dark',
        projection: 'BD:09',
        exteral: {
          subdomains: BaiduConstomSubdomains,
          attribution: '百度-自定义-黑夜',
        },
      },
      {
        label: '红色警戒',
        value: 'redalert',
        projection: 'BD:09',
        exteral: {
          subdomains: BaiduConstomSubdomains,
          attribution: '百度-自定义-红色警戒',
        },
      },
      {
        label: '精简(仿google)',
        value: 'googlelite',
        projection: 'BD:09',
        exteral: {
          subdomains: BaiduConstomSubdomains,
          attribution: '百度-自定义-精简',
        },
      },
      {
        label: '自然绿',
        value: 'grassgreen',
        projection: 'BD:09',
        exteral: {
          subdomains: BaiduConstomSubdomains,
          attribution: '百度-自定义-自然绿',
        },
      },
      {
        label: '浪漫粉',
        value: 'pink',
        projection: 'BD:09',
        exteral: {
          subdomains: BaiduConstomSubdomains,
          attribution: '百度-自定义-浪漫粉',
        },
      },
      {
        label: '青春绿',
        value: 'darkgreen',
        projection: 'BD:09',
        exteral: {
          subdomains: BaiduConstomSubdomains,
          attribution: '百度-自定义-青春绿',
        },
      },
      {
        label: '清新蓝绿',
        value: 'bluish',
        projection: 'BD:09',
        exteral: {
          subdomains: BaiduConstomSubdomains,
          attribution: '百度-自定义-清新蓝绿',
        },
      },
      {
        label: '高端灰',
        value: 'grayscale',
        projection: 'BD:09',
        exteral: {
          subdomains: BaiduConstomSubdomains,
          attribution: '百度-自定义-高端灰',
        },
      },
      {
        label: '强边界',
        value: 'hardedge',
        projection: 'BD:09',
        exteral: {
          subdomains: BaiduConstomSubdomains,
          attribution: '百度-自定义-强边界',
        },
      },
    ],
  },
  {
    label: '腾讯',
    value: 'Tencent',
    children: [
      {
        label: '电子地图',
        value: 'Normal',
        projection: 'EPSG:3857',
        exteral: {
          attribution: '腾讯-电子电梯',
        },
      },
      {
        label: '卫星地图',
        value: 'Satellite',
        projection: 'EPSG:3857',
        exteral: {
          attribution: '腾讯-卫星地图',
        },
      },
      {
        label: '地形图',
        value: 'Terrain',
        projection: 'EPSG:3857',
        exteral: {
          attribution: '腾讯-地形图',
        },
      },
    ],
  },
  {
    label: 'OpenStreetMap',
    value: 'Osm',
    children: [
      {
        label: '电子地图',
        value: 'Normal',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'OpenStreetMap-电子地图',
        },
      },
      {
        label: '骑行图',
        value: 'Bike',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'OpenStreetMap-骑行图',
        },
      },
      {
        label: '交通图',
        value: 'Transport',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'OpenStreetMap-交通图',
        },
      },
      {
        label: '山地图',
        value: 'Humanitarian',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'OpenStreetMap-山地图',
        },
      },
    ],
  },
  {
    label: 'CartoDb',
    value: 'CartoDb',
    children: [
      {
        label: '地图(白)',
        value: 'Light',
        projection: 'EPSG:3857',

        exteral: {
          attribution: 'CartoDb-白',
        },
      },
      {
        label: '地图(黑)',
        value: 'Dark',
        projection: 'EPSG:3857',

        exteral: {
          attribution: 'CartoDb-黑',
        },
      },
    ],
  },
  {
    label: 'ArcGIS',
    value: 'Geoq',
    children: [
      {
        label: '彩色',
        value: 'Colour',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'ArcGIS-彩色',
        },
      },
      {
        label: '灰度',
        value: 'Gray',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'ArcGIS-灰度',
        },
      },
      {
        label: '午夜蓝',
        value: 'Midnightblue',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'ArcGIS-午夜蓝',
        },
      },
    ],
  },
  {
    label: '天地图',
    value: 'Tdt',
    children: [
      {
        label: '普通',
        value: 'Normal',
        projection: 'EPSG:3857',
        exteral: {
          subdomains: ['0', '1', '2'],
          attribution: '天地图-普通地图',
        },
      },
      {
        label: '卫星',
        value: 'Satellite',
        projection: 'EPSG:3857',
        exteral: {
          subdomains: ['0', '1', '2'],
          attribution: '天地图-卫星地图',
        },
      },
      {
        label: '地形',
        value: 'Terrain',
        projection: 'EPSG:3857',
        exteral: {
          subdomains: ['0', '1', '2'],
          attribution: '天地图-地形图',
        },
      },
    ],
  },
  {
    label: 'Mapbox',
    value: 'Mapbox',
    children: [
      {
        label: '街景',
        value: 'Streets',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'Mapbox-街景',
        },
      },
      {
        label: '暗黑',
        value: 'Dark',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'Mapbox-暗黑',
        },
      },
      {
        label: '浅黑',
        value: 'LightDark',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'Mapbox-浅黑',
        },
      },
      {
        label: '卫星',
        value: 'Satellite',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'Mapbox-卫星',
        },
      },
      {
        label: '浅色',
        value: 'Light',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'Mapbox-浅色',
        },
      },
      {
        label: 'Emerald',
        value: 'Emerald',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'Mapbox-Emerald',
        },
      },
      {
        label: '白色',
        value: 'White',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'Mapbox-白色',
        },
      },
      {
        label: '红色',
        value: 'Red',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'Mapbox-红色',
        },
      },
      {
        label: 'Outdoors',
        value: 'Outdoors',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'Mapbox-Outdoors',
        },
      },
      {
        label: 'StreetsSatellite',
        value: 'StreetsSatellite',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'Mapbox-StreetsSatellite',
        },
      },
      {
        label: 'Comic',
        value: 'Comic',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'Mapbox-Comic',
        },
      },
      {
        label: '建筑',
        value: 'Building',
        projection: 'EPSG:3857',
        exteral: {
          attribution: 'Mapbox-建筑',
        },
      },
    ],
  },
];

export function defaultMap() {
  // {parent: 'Amap',layer:{ label: '电子地图',
  //         value: 'Normal',
  //         projection: 'EPSG:3857',
  //         exteral: {
  //           attribution: '高德-电子地图',
  //         },}}
  let layer = null;
  if (mapList.length > 0 && mapList[0]) {
    layer = mapList[0].children;
  }
  return { parent: mapList[0].value, layer: layer ? layer[0] : null };
}

export function getMapList() {
  const list = [...mapList];
  const setUid = function (item: typeMapList) {
    item.uuid = nanoid();
    if (Array.isArray(item.children)) {
      item.children.forEach(child => {
        child.pid = item.uuid;
        setUid(child);
      });
    }
  };
  list.forEach(item => {
    setUid(item);
  });
  return list;
}
