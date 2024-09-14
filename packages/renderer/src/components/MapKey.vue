<script setup lang="ts">
import { ref, watch, defineEmits, onBeforeUnmount, onMounted } from 'vue';
import { getKeys, setKeys } from '/@/utils/map-key';

const props = defineProps({
  visible: {
    required: true,
    type: Boolean,
  },
});
let showModal = ref(false);
let tdtKey = ref<string | null>('');
let mapboxKey = ref<string | null>('');
const emit = defineEmits(['hide', 'update:visible']);
watch(
  () => props.visible,
  () => {
    showModal.value = props.visible;
  },
);
const init = () => {
  const data = getKeys();
  tdtKey.value = data?.tdtKey;
  mapboxKey.value = data?.mapboxKey;
};
const cancel = () => {
  emit('hide');
  emit('update:visible', false);
};
const ok = () => {
  setKeys({
    tdtKey: tdtKey.value || '',
    mapboxKey: mapboxKey.value || '',
  });
  cancel();
};
onBeforeUnmount(() => {
  showModal.value = props.visible;
});
onMounted(() => {
  init();
});
</script>

<template>
  <n-modal
    :show="showModal"
    :show-icon="false"
    :on-mask-click="cancel"
    :on-esc="cancel"
    :on-close="cancel"
    preset="dialog"
  >
    <template #header> 地图Key配置 </template>
    <div class="dialog-content">
      <div class="item">
        <span class="label">天地图：</span>
        <input
          v-model="tdtKey"
          class="value"
          type="text"
        />
      </div>
      <div class="item">
        <span class="label">MapBox：</span>
        <input
          v-model="mapboxKey"
          class="value"
          type="text"
        />
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

<style scoped></style>
