import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '/@/views/HomePage.vue';
import About from '/@/views/About.vue';

export const constantRoutes: Array<RouteRecordRaw> = [
  {path: '/', name: 'Home', component: HomePage},
  {path: '/about', name: 'About', component: About},
];

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHashHistory(),
  routes: constantRoutes,
});

export default router;
