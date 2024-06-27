<script setup lang="ts">
import {onMounted, ref} from 'vue';
import TMap from '/@/utils/t-map';
import {useMessage} from 'naive-ui';
import SaveDialog from '/@/components/SaveDialog.vue';
import ProgressControl from '/@/components/ProgressControl.vue';
import FileSave from '../utils/file-save.js';

window.$message = useMessage();
let map = ref();
let visible = ref(false);
let extent = ref([]);
const getMapViewExtent = ()=> {
  extent.value = map.value.getMapViewExtent();
  visible.value = true;
};
const save = (params) => {
  // console.log(params);
  visible.value = false;
  const layers = map.value.map.getLayers();
  const tileLayers = layers.getArray().filter(layer => layer.get('base'));
  const mapConfig = {
    titleLayer: tileLayers,
    config: {
      urlTemplate: tileLayers[0].getSource().getUrls()[0],
    },
    projection: {
      ...tileLayers[0].getSource().getProjection(),
      code: tileLayers[0].getSource().getProjection().getCode(),
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
onMounted(() => {
  map.value = new TMap('map');
});
</script>

<template>
  <div id="map"></div>
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
      ><path
        d="M32 26v-2h-2.101a4.968 4.968 0 0 0-.732-1.753l1.49-1.49l-1.414-1.414l-1.49 1.49A4.968 4.968 0 0 0 26 20.101V18h-2v2.101a4.968 4.968 0 0 0-1.753.732l-1.49-1.49l-1.414 1.414l1.49 1.49A4.968 4.968 0 0 0 20.101 24H18v2h2.101a4.968 4.968 0 0 0 .732 1.753l-1.49 1.49l1.414 1.414l1.49-1.49a4.968 4.968 0 0 0 1.753.732V32h2v-2.101a4.968 4.968 0 0 0 1.753-.732l1.49 1.49l1.414-1.414l-1.49-1.49A4.968 4.968 0 0 0 29.899 26zm-7 2a3 3 0 1 1 3-3a3.003 3.003 0 0 1-3 3z"
        fill="currentColor"
      ></path><circle
        cx="7"
        cy="20"
        r="2"
        fill="currentColor"
      ></circle><path
        d="M14 20a4 4 0 1 1 4-4a4.012 4.012 0 0 1-4 4zm0-6a2 2 0 1 0 2 2a2.006 2.006 0 0 0-2-2z"
        fill="currentColor"
      ></path><circle
        cx="21"
        cy="12"
        r="2"
        fill="currentColor"
      ></circle><path
        d="M13.02 28.271L3 22.427V9.574l11-6.416l11.496 6.706l1.008-1.728l-12-7a1 1 0 0 0-1.008 0l-12 7A1 1 0 0 0 1 9v14a1 1 0 0 0 .496.864L12.013 30z"
        fill="currentColor"
      ></path></svg>
    </n-icon>
    <template #menu>
      <n-tooltip
        trigger="hover"
        placement="right"
      >
        <template #trigger>
          <span style="display: inline-block">
            <n-float-button
              position="relative"
              @click="getMapViewExtent"
            >
              <n-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24"
                ><g
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ><path d="M10 12H3l3-3m0 6l-3-3"></path><path d="M14 12h7l-3-3m0 6l3-3"></path><path d="M3 6V3h18v3"></path><path d="M3 18v3h18v-3"></path></g></svg>
              </n-icon>
            </n-float-button>
          </span>
        </template>
        获取当前视窗经纬度范围
      </n-tooltip>
    </template>
  </n-float-button>
  <save-dialog
    v-model:visible="visible"
    base-layer=""
    :extent="extent"
    @ok="save"
  ></save-dialog>
  <progress-control></progress-control>
</template>

<style lang="scss" scoped>
#map{
  position: absolute;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.box-controls{
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
  .splitline{
    width: 1px;
    height: 20px;
    margin: 0 8px;
    background-color: #999999;
  }
}

</style>
