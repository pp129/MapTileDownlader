<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { setProgressDom, showProgress, setProgress, setState } from '../utils/progress';
const progressSuccess = ref();
const progressError = ref();
const progress = ref();
const container = ref();
const emit = defineEmits(['close']);
const closeProgress = () => {
  setProgress({ success: 0, error: 0, percentage: 0, count: 0 });
  setState(false);
  showProgress(false);
  emit('close');
};
onMounted(() => {
  setProgressDom({
    success: progressSuccess.value,
    error: progressError.value,
    progress: progress.value,
    container: container.value,
  });
});
</script>

<template>
  <div
    ref="container"
    class="box-progress"
  >
    <progress
      ref="progress"
      class="progress"
      value="0"
      max="100"
    />
    <div class="item">
      已下载:<span
        ref="progressSuccess"
        class="success"
      />
    </div>
    <div class="item">
      失败:<span
        ref="progressError"
        class="error"
      />
    </div>
    <button @click="closeProgress"> 关闭 </button>
  </div>
</template>

<style lang="scss" scoped>
.box-progress {
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-color: white;
  box-shadow: 0 2px 4px 0 rgb(54 58 80 / 30%);
  width: 200px;
  padding: 8px;
  z-index: 100;
  display: none;
  .progress {
    width: 100%;
  }
  .item {
    text-align: left;
  }
}
</style>
