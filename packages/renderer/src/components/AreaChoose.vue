<script setup lang="ts">
import { ref, watch, defineEmits, onBeforeUnmount } from 'vue';
import { getAreaList } from '/@/utils/area-list';

const props = defineProps({
  visible: {
    required: true,
    type: Boolean,
  },
});
let showModal = ref(false);
const layerList = getAreaList();
const layers = ref(layerList);
let pattern = ref('');
const emit = defineEmits(['hide', 'update:visible', 'choose']);
watch(
  () => props.visible,
  () => {
    showModal.value = props.visible;
  },
);
const cancel = () => {
  emit('hide');
  emit('update:visible', false);
};
const handleSelect = (keys: any, options: any) => {
  const option = options[0];
  option.fetchLoad().then((geojson: any) => {
    emit('choose', { option, geojson });
  });
};
onBeforeUnmount(() => {
  showModal.value = props.visible;
});
</script>

<template>
  <n-modal
    v-model:show="showModal"
    transform-origin="center"
    :show-icon="false"
    :on-mask-click="cancel"
    :on-esc="cancel"
    :on-close="cancel"
    preset="dialog"
  >
    <n-card
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-input
        v-model:value="pattern"
        placeholder="搜索"
        clearable
      />
      <n-tree
        :show-irrelevant-nodes="false"
        :pattern="pattern"
        block-line
        :data="layers"
        :key-field="'areaCode'"
        :label-field="'areaName'"
        :default-expanded-keys="[-1]"
        :default-expand-all="pattern !== ''"
        :on-update:selected-keys="handleSelect"
        selectable
        virtual-scroll
        style="height: 320px"
      />
    </n-card>
  </n-modal>
</template>

<style scoped></style>
