import {createApp} from 'vue';
import App from '/@/App.vue';
import router from '/@/router';
import {
  // create naive ui
  create,
  // component
  NButton,
  NFloatButton,
  NIcon,
  NIconWrapper,
  NTooltip,
  NPopover,
  NModal,
  NMessageProvider,
  NNotificationProvider,
  NDescriptions,
  NDescriptionsItem,
  NPopselect,
  NDropdown,
  NTree,
  NCard,
  NInput,
  NInputGroup,
  NFlex,
} from 'naive-ui';
import 'ol/ol.css';
// 通用字体
import 'vfonts/Lato.css';
// 等宽字体
import 'vfonts/FiraCode.css';
import './style/index.scss';
const naive = create({
  components: [
    NButton,
    NFloatButton,
    NIcon,
    NIconWrapper,
    NTooltip,
    NPopover,
    NModal,
    NMessageProvider,
    NNotificationProvider,
    NDescriptions,
    NDescriptionsItem,
    NPopselect,
    NDropdown,
    NTree,
    NCard,
    NInput,
    NInputGroup,
    NFlex,
  ],
});

createApp(App).use(router).use(naive).mount('#app');
