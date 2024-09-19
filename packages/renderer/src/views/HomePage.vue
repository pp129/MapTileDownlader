<script setup lang="ts">
import { onMounted, ref } from 'vue';
import TMap from '/@/utils/t-map';
import { useMessage } from 'naive-ui';
import SaveDialog from '/@/components/SaveDialog.vue';
import MapKey from '/@/components/MapKey.vue';
import AreaChoose from '/@/components/AreaChoose.vue';
import ProgressControl from '/@/components/ProgressControl.vue';
import FileSave from '/@/utils/file-save';
import { getMapList } from '/@/utils/layer-list';
import { getKeys } from '/@/utils/map-key';
import type { Layer } from 'ol/layer';
import type { Projection } from 'ol/proj';
import type MapEvent from 'ol/MapEvent';
import { MenuSharp, DownloadOutline, LayersOutline, SearchSharp } from '@vicons/ionicons5';

const layerList = getMapList();
window.$message = useMessage();

let map = ref();
let visible = ref(false);
let keyVisible = ref(false);
let areaVisible = ref(false);
let extent = ref([]);
let options = ref([...layerList]);
let currentLayer = ref();
let saveLayers = ref([]);
let zoom = ref(0);
let center = ref([0, 0]);
let areaName = ref('');
let downloading = ref(false);
const getMapViewExtent = () => {
  extent.value = map.value.getMapViewExtent();
  // extent.value = map.value._vectorLayer.getSource().getFeatures()[0].getGeometry().getExtent();
  // saveLayers.value = {};
  visible.value = true;
};
interface TypeSave {
  savePath: string;
  minZoom: number;
  maxZoom: number;
  extent: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}
const save = (params: TypeSave) => {
  visible.value = false;
  const layers = map.value.map.getLayers();
  const baseLayers = layers.getArray().filter((layer: Layer) => layer.get('base'));
  let urlTemplate = '';
  let projection: Projection;
  let tileLayers = baseLayers;
  // 先判断是否是groupLayer
  if (baseLayers[0].getProperties().group) {
    const urls = baseLayers[0].getLayers().getArray()[0].getSource().getUrls();
    urlTemplate = urls ? urls[0] : baseLayers[0].getLayers().getArray()[0].getProperties().urlTemplate;
    projection = baseLayers[0].getLayers().getArray()[0].getSource().getProjection();
    tileLayers = baseLayers[0].getLayers().getArray();
  } else {
    const urls = baseLayers[0].getSource().getUrls();
    urlTemplate = urls ? urls[0] : baseLayers[0].getProperties().urlTemplate;
    projection = baseLayers[0].getSource().getProjection();
  }

  const mapConfig = {
    titleLayer: tileLayers,
    config: {
      urlTemplate,
      group: baseLayers[0].getProperties().group,
    },
    mergeLayers: false,
    projection: {
      ...projection,
      code: projection.getCode(),
    },
  };
  const data = {
    ...params,
    mapConfig,
  };
  new FileSave(data);
};
const handleSelect = (key: any, layer: any) => {
  const parent = options.value.find(item => {
    return item.uuid === layer.pid;
  });
  if (parent) {
    const { mapboxKey, tdtKey } = getKeys();
    if ((parent.value === 'Mapbox' && !mapboxKey) || (parent.value === 'Tdt' && !tdtKey)) {
      window.$message.warning(`请设置${parent.label}地图Key`);
      keyVisible.value = true;
      return false;
    }
    currentLayer.value = { parent: parent.value, layer: layer };
    map.value.switchBaseLayer(currentLayer.value);
  }
};
const setArea = () => {
  areaVisible.value = true;
};
interface GeoJsonData {
  geojson: any;
  option: any;
}
const onAreaChoose = ({ geojson, option }: GeoJsonData) => {
  areaName.value = option.areaName;
  map.value.addGeometry(geojson);
};
const zoomEnd = (evt: MapEvent) => {
  getMapView();
  evt.map.once('moveend', (evt: MapEvent) => {
    zoomEnd(evt);
  });
};
const getMapView = () => {
  zoom.value = Math.floor(map.value.map.getView().getZoom());
  const mapCenter = map.value.map.getView().getCenter();
  center.value = [Number(mapCenter[0].toFixed(6)), Number(mapCenter[1].toFixed(6))];
};
const onTagClose = () => {
  areaName.value = '';
  map.value._vectorLayer.getSource().clear();
};
const onClose = () => {
  downloading.value = false;
};
onMounted(() => {
  map.value = new TMap('map');
  // 层级变化
  getMapView();
  map.value.map.getView().once('change:resolution', () => {
    map.value.map.once('moveend', (evt: MapEvent) => {
      zoomEnd(evt);
    });
  });
});
</script>

<template>
  <div id="map"></div>
  <n-card
    hoverable
    size="small"
    class="info-card"
  >
    <n-flex>
      <span style="line-height: 28px">当前层级：{{ zoom }}</span>
      <span style="line-height: 28px">可视区域中心点 {{ center }}</span>
      <n-tag
        v-show="areaName"
        closable
        type="success"
        @close="onTagClose"
      >
        {{ areaName }}
      </n-tag>
    </n-flex>
  </n-card>
  <n-float-button
    position="absolute"
    right="40px"
    bottom="40px"
    type="primary"
    menu-trigger="click"
  >
    <n-icon
      :size="25"
      :component="MenuSharp"
    />
    <template #menu>
      <!-- 获取当前视窗经纬度范围 -->
      <n-tooltip
        trigger="hover"
        placement="right"
      >
        <template #trigger>
          <span style="display: inline-block">
            <n-button
              position="relative"
              type="info"
              circle
              size="large"
              @click="getMapViewExtent"
            >
              <n-icon
                size="25"
                :component="DownloadOutline"
              />
            </n-button>
          </span>
        </template>
        下载当前视窗经纬度范围的栅格瓦片
      </n-tooltip>
      <!-- 地图切换 -->
      <n-tooltip
        trigger="hover"
        placement="right"
      >
        <template #trigger>
          <span style="display: inline-block">
            <n-dropdown
              :options="options"
              placement="left-center"
              trigger="click"
              :key-field="'uuid'"
              @select="handleSelect"
            >
              <n-button
                color="#fff"
                circle
                size="large"
              >
                <n-icon
                  size="25"
                  color="#000"
                  :component="LayersOutline"
                />
              </n-button>
            </n-dropdown>
          </span>
        </template>
        地图切换
      </n-tooltip>
      <!-- 选择区域 -->
      <n-tooltip
        trigger="hover"
        placement="right"
      >
        <template #trigger>
          <span style="display: inline-block">
            <n-float-button
              position="relative"
              @click="setArea"
            >
              <n-icon
                size="20"
                :component="SearchSharp"
              />
            </n-float-button>
          </span>
        </template>
        选择区域
      </n-tooltip>
    </template>
  </n-float-button>
  <save-dialog
    v-model:visible="visible"
    :base-layer="saveLayers"
    :extent="extent"
    @ok="save"
  ></save-dialog>
  <map-key v-model:visible="keyVisible"></map-key>
  <area-choose
    v-model:visible="areaVisible"
    @choose="onAreaChoose"
  ></area-choose>
  <progress-control @close="onClose"></progress-control>
</template>

<style lang="scss" scoped>
#map {
  position: absolute;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.box-controls {
  position: absolute;
  left: 70px;
  top: 10px;
  background-color: white;
  box-shadow: 0px 2px 4px 0px rgb(54 58 80 / 30%);
  // width: 200px;
  padding: 8px;
  display: flex;
  // .items{
  //   width: 20px;
  //   height: 20px;
  //   background-size: contain;
  //   background-repeat: no-repeat;
  //   background-position: center center;
  //   cursor: pointer;
  // }
  .splitline {
    width: 1px;
    height: 20px;
    margin: 0 8px;
    background-color: #999999;
  }
}
.info-card {
  width: auto;
  position: absolute;
  top: 10px;
  left: 50px;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
}
</style>
