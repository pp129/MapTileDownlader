<script setup lang="ts">
import { ref, watch, defineEmits, onBeforeUnmount, computed } from 'vue';

const props = defineProps({
  visible: {
    required: true,
    type: Boolean,
  },
  extent: {
    type: Array as () => Array<number>,
    required: true,
    validator: (value: Array<number>) => value.length === 4,
  },
  baseLayer: {
    required: true,
    type: [Object, Array],
  },
});
let showModal = ref(false);
let showMerge = ref(false);
let savePath = ref('');
let maxZoom = ref('18');
let minZoom = ref('1');
let mergeLayers = ref(false);

const downloadExtent = computed(() => {
  console.log(props.extent);
  return {
    xmin: props.extent[0],
    xmax: props.extent[2],
    ymin: props.extent[1],
    ymax: props.extent[3],
  };
});
watch(
  () => props.visible,
  () => {
    showModal.value = props.visible;
  },
);
const emit = defineEmits(['cancel', 'update:visible', 'ok']);
const reset = () => {
  savePath.value = '';
  maxZoom.value = '18';
  minZoom.value = '1';
};
const cancel = () => {
  reset();
  emit('update:visible', false);
  emit('cancel');
};
const ok = () => {
  if (!savePath.value) {
    return window.$message.warning('请选择保存目录');
  }
  if (!maxZoom.value) {
    return window.$message.warning('请输入最大层级');
  }
  if (!minZoom.value) {
    return window.$message.warning('请输入最小层级');
  }
  const minZoomVal = parseInt(minZoom.value);
  const maxZoomVal = parseInt(maxZoom.value);
  if (isNaN(minZoomVal) || isNaN(maxZoomVal)) {
    return window.$message.warning('层级格式错误，请输入非负整数');
  }
  if (minZoomVal >= maxZoomVal || minZoomVal < 0 || maxZoomVal > 18) {
    return window.$message.warning('层级格式错误');
  }
  const param = {
    savePath: savePath.value,
    minZoom: minZoomVal,
    maxZoom: maxZoomVal,
    extent: downloadExtent.value,
  };
  emit('ok', param);
};
const setFolder = async () => {
  const result = await window.electron.openFile();
  if (result.canceled) return;
  savePath.value = result.filePaths[0];
};
onBeforeUnmount(() => {
  showModal.value = props.visible;
});
</script>

<template>
  <n-modal
    :show="showModal"
    :show-icon="false"
    :on-mask-click="cancel"
    :on-esc="cancel"
    :on-close="cancel"
    title="下载参数配置"
    preset="dialog"
  >
    <div class="dialog-content">
      <n-descriptions
        label-placement="left"
        title="下载范围"
        size="small"
        :column="1"
        class="descriptions"
      >
        <n-descriptions-item label="xmin">
          {{ downloadExtent.xmin }}
        </n-descriptions-item>
        <n-descriptions-item label="xmax">
          {{ downloadExtent.xmax }}
        </n-descriptions-item>
        <n-descriptions-item label="ymin">
          {{ downloadExtent.ymin }}
        </n-descriptions-item>
        <n-descriptions-item label="ymax">
          {{ downloadExtent.ymax }}
        </n-descriptions-item>
      </n-descriptions>
      <div class="item">
        <span class="label">最大层级：</span>
        <input
          v-model="maxZoom"
          class="value"
          type="text"
        />
      </div>
      <div class="item">
        <span class="label">最小层级：</span>
        <input
          v-model="minZoom"
          class="value"
          type="text"
        />
      </div>
      <div
        v-if="showMerge"
        class="item"
      >
        <span class="label">标注下载：</span>
        <div class="value">
          <input
            v-model="mergeLayers"
            type="checkbox"
          />是否合并
        </div>
      </div>
      <div class="item">
        <span class="label">下载路径：</span>
        <div class="value">
          <n-input-group>
            <n-input
              v-model:value="savePath"
              disabled
              type="text"
              placeholder="选择下载路径"
              :style="{ width: '80%' }"
            />
            <n-button
              type="primary"
              ghost
              @click="setFolder"
            >
              选择
            </n-button>
          </n-input-group>
        </div>
      </div>
    </div>
    <template #action>
      <n-button @click="cancel"> 取消 </n-button>
      <n-button
        type="info"
        @click="ok"
      >
        确定
      </n-button>
    </template>
  </n-modal>
</template>

<style lang="scss" scoped>
.dialog-content {
  width: 100%;
  padding: 8px 16px;
  .item {
    margin: 8px 0;
    display: flex;
    align-items: center;
  }
  .label {
    display: inline-block;
    width: 80px;
    text-align: right;
  }
  .value {
    display: inline-block;
    width: calc(100% - 80px);
  }
}
.descriptions {
  ::v-deep(.n-descriptions-header) {
    font-size: 14px;
    margin-bottom: 3px;
  }
  ::v-deep(.n-descriptions-table-content__label) {
    display: inline-block;
    width: 80px;
    text-align: right;
  }
}
</style>
