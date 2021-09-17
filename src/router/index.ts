import Vue from "vue";
import VueRouter from "vue-router";

// import About from "../views/About.vue";
import Annotate from "../views/Annotate.vue";
// import Upload from "../views/Upload.vue";
import Tutorial from "../views/Tutorial.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

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
    },
    {
        path: "/upload",
        name: "upload",
        order: 1,
        component: Upload
    },
    {
        path: "/login",
        name: "login",
        order: 1,
        component: Login
    },
    {
        path: "/register",
        name: "register",
        order: 1,
        component: Register
    }
];

export default new VueRouter({
    routes
});
