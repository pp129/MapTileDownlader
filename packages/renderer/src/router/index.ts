import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '/@/views/Home.vue';
import About from '/@/views/About.vue';

export const constantRoutes: Array<RouteRecordRaw> = [
  {path: '/', name: 'Home', component: Home},
  {path: '/about', name: 'About', component: About},
];

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHashHistory(),
  routes: constantRoutes,
});

export default router;
