import Vue from "vue";
import VueRouter from "vue-router";

// import About from "../views/About.vue";
import Annotate from "../views/Annotate.vue";
// import Upload from "../views/Upload.vue";
import Tutorial from "../views/Tutorial.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "annotate",
    order: 0,
    component: Annotate
  },
  {
    path: "/tutorial",
    name: "tutorial",
    order: 1,
    component: Tutorial
  }
];

export default new VueRouter({
  routes
});
