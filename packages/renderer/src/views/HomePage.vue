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
const save = (params: TypeSave) => {
  // console.log(params);
  visible.value = false;
  const layers = map.value.map.getLayers();
  const baseLayers = layers.getArray().filter((layer: Layer) => layer.get('base'));
  console.log(baseLayers[0]);
  let urlTemplate = '';
  let projection: Projection;
  let tileLayers = baseLayers;
  // 先判断是否是groupLayer
  if (baseLayers[0].getProperties().group) {
    const urls = baseLayers[0].getLayers().getArray()[0].getSource().getUrls();
    urlTemplate = urls
      ? urls[0]
      : baseLayers[0].getLayers().getArray()[0].getProperties().urlTemplate;
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
  console.log(data);
  console.log(data.mapConfig.projection.code);
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
const onAreaChoose = ({ geojson, option }) => {
  console.log('onAreaChoose', option);
  areaName.value = option.areaName;
  map.value.addGeometry(geojson);
};
const zoomEnd = (evt: Event) => {
  getMapView();
  evt.map.once('moveend', (evt: Event) => {
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
    map.value.map.once('moveend', (evt: Event) => {
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
    <n-icon :size="25">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 32 32"
      >
        <path
          d="M32 26v-2h-2.101a4.968 4.968 0 0 0-.732-1.753l1.49-1.49l-1.414-1.414l-1.49 1.49A4.968 4.968 0 0 0 26 20.101V18h-2v2.101a4.968 4.968 0 0 0-1.753.732l-1.49-1.49l-1.414 1.414l1.49 1.49A4.968 4.968 0 0 0 20.101 24H18v2h2.101a4.968 4.968 0 0 0 .732 1.753l-1.49 1.49l1.414 1.414l1.49-1.49a4.968 4.968 0 0 0 1.753.732V32h2v-2.101a4.968 4.968 0 0 0 1.753-.732l1.49 1.49l1.414-1.414l-1.49-1.49A4.968 4.968 0 0 0 29.899 26zm-7 2a3 3 0 1 1 3-3a3.003 3.003 0 0 1-3 3z"
          fill="currentColor"
        ></path>
        <circle
          cx="7"
          cy="20"
          r="2"
          fill="currentColor"
        ></circle>
        <path
          d="M14 20a4 4 0 1 1 4-4a4.012 4.012 0 0 1-4 4zm0-6a2 2 0 1 0 2 2a2.006 2.006 0 0 0-2-2z"
          fill="currentColor"
        ></path>
        <circle
          cx="21"
          cy="12"
          r="2"
          fill="currentColor"
        ></circle>
        <path
          d="M13.02 28.271L3 22.427V9.574l11-6.416l11.496 6.706l1.008-1.728l-12-7a1 1 0 0 0-1.008 0l-12 7A1 1 0 0 0 1 9v14a1 1 0 0 0 .496.864L12.013 30z"
          fill="currentColor"
        ></path>
      </svg>
    </n-icon>
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
              <n-icon size="25">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 20 20"
                >
                  <g fill="none">
                    <path
                      d="M9 5.5a4.5 4.5 0 0 1 4-4.473v3.766l-.646-.647a.5.5 0 0 0-.708.707l1.5 1.5a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.707L14 4.793V1.027A4.5 4.5 0 1 1 9 5.5zm2 2a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1h-4a.5.5 0 0 0-.5.5zm6 2.243a5.507 5.507 0 0 1-1 .657v.6h-3.5a.5.5 0 0 0-.5.5a2 2 0 1 1-4 0a.5.5 0 0 0-.5-.5H4V8h4.6a5.463 5.463 0 0 1-.393-1H4a2 2 0 0 1 2-2h2.022a5.48 5.48 0 0 1 .185-1H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V9.743zM16 15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3h3.041a3 3 0 0 0 5.918 0H16v3z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
              </n-icon>
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
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M434.8 137.65l-149.36-68.1c-16.19-7.4-42.69-7.4-58.88 0L77.3 137.65c-17.6 8-17.6 21.09 0 29.09l148 67.5c16.89 7.7 44.69 7.7 61.58 0l148-67.5c17.52-8 17.52-21.1-.08-29.09z"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="32"
                    ></path>
                    <path
                      d="M160 308.52l-82.7 37.11c-17.6 8-17.6 21.1 0 29.1l148 67.5c16.89 7.69 44.69 7.69 61.58 0l148-67.5c17.6-8 17.6-21.1 0-29.1l-79.94-38.47"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="32"
                    ></path>
                    <path
                      d="M160 204.48l-82.8 37.16c-17.6 8-17.6 21.1 0 29.1l148 67.49c16.89 7.7 44.69 7.7 61.58 0l148-67.49c17.7-8 17.7-21.1.1-29.1L352 204.48"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="32"
                    ></path>
                  </svg>
                </n-icon>
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
              <n-icon size="20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 32 32"
                >
                  <path
                    d="M31 29.586l-4.689-4.688a8.028 8.028 0 1 0-1.414 1.414L29.586 31zM20 26a6 6 0 1 1 6-6a6.007 6.007 0 0 1-6 6z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M8 26H4a2.002 2.002 0 0 1-2-2v-4h2v4h4z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M2 12h2v4H2z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M26 8h-2V4h-4V2h4a2.002 2.002 0 0 1 2 2z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M12 2h4v2h-4z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M4 8H2V4a2.002 2.002 0 0 1 2-2h4v2H4z"
                    fill="currentColor"
                  ></path>
                </svg>
              </n-icon>
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
