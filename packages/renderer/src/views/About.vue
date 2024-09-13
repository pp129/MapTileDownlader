<script lang="ts" setup>
import ReactiveCounter from '/@/components/ReactiveCounter.vue';
import ReactiveHash from '/@/components/ReactiveHash.vue';
import ElectronVersions from '/@/components/ElectronVersions.vue';
import logo from '/@/assets/logo.svg';
import { useRouter } from 'vue-router';

const APP_VERSION = import.meta.env.VITE_APP_VERSION;
const router = useRouter();
const backHome = () => {
  router.push({
    name: 'Home',
  });
};
</script>

<template>
  <n-float-button
    :left="16"
    :top="16"
    @click="backHome"
  >
    <n-icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 512 512"
      >
        <path
          d="M261.56 101.28a8 8 0 0 0-11.06 0L66.4 277.15a8 8 0 0 0-2.47 5.79L63.9 448a32 32 0 0 0 32 32H192a16 16 0 0 0 16-16V328a8 8 0 0 1 8-8h80a8 8 0 0 1 8 8v136a16 16 0 0 0 16 16h96.06a32 32 0 0 0 32-32V282.94a8 8 0 0 0-2.47-5.79z"
          fill="currentColor"
        ></path>
        <path
          d="M490.91 244.15l-74.8-71.56V64a16 16 0 0 0-16-16h-48a16 16 0 0 0-16 16v32l-57.92-55.38C272.77 35.14 264.71 32 256 32c-8.68 0-16.72 3.14-22.14 8.63l-212.7 203.5c-6.22 6-7 15.87-1.34 22.37A16 16 0 0 0 43 267.56L250.5 69.28a8 8 0 0 1 11.06 0l207.52 198.28a16 16 0 0 0 22.59-.44c6.14-6.36 5.63-16.86-.76-22.97z"
          fill="currentColor"
        ></path>
      </svg>
    </n-icon>
  </n-float-button>
  <div class="app">
    <img
      alt="Vue logo"
      :src="logo"
      width="150"
    />

    <p>
      <!-- Example how to inject current app version to UI -->
      App version: {{ APP_VERSION }}
    </p>

    <p>
      For a guide and recipes on how to configure / customize this project,<br />
      check out the
      <a
        href="https://github.com/cawa-93/vite-electron-builder"
        target="_blank"
      >
        vite-electron-builder documentation
      </a>
      .
    </p>

    <fieldset>
      <legend>Test Vue Reactivity</legend>
      <reactive-counter />
    </fieldset>

    <fieldset>
      <legend>Test Node.js API</legend>
      <reactive-hash />
    </fieldset>

    <fieldset>
      <legend>Environment</legend>
      <electron-versions />
    </fieldset>

    <p>
      Edit
      <code>packages/renderer/src/App.vue</code> to test hot module replacement.
    </p>
  </div>
</template>

<style scoped>
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  max-width: 700px;
}

fieldset {
  margin: 2rem;
  padding: 1rem;
}
</style>
