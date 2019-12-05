import Vue from 'vue';
import VueRouter from 'vue-router';
import Upload from '../views/Upload.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'upload',
    component: Upload,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
