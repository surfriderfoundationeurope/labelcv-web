import Vue from 'vue';
import VueRouter from 'vue-router';

import About from '../views/About.vue';
import Annotate from '../views/Annotate.vue';
import Upload from '../views/Upload.vue';
import Tutorial from '../views/Tutorial.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'about',
    order: 0,
    component: About,
  },
  {
    path: '/tutorial',
    name: 'tutorial',
    order: 1,
    component: Tutorial,
  },
  {
    path: '/annotate',
    name: 'annotate',
    order: 2,
    component: Annotate,
  },
  {
    path: '/upload',
    name: 'upload',
    order: 3,
    component: Upload,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
