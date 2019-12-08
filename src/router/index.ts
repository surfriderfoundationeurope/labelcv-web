import Vue from 'vue';
import VueRouter from 'vue-router';

import About from '../views/About.vue';
import Annotate from '../views/Annotate.vue';
import Upload from '../views/Upload.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'about',
    order: 0,
    component: About,
  },
  {
    path: '/upload',
    name: 'upload',
    order: 1,
    component: Upload,
  },
  {
    path: '/annotate',
    name: 'annotate',
    order: 2,
    component: Annotate,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
