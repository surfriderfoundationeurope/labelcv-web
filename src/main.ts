import Vue from "vue";
import App from "./App.vue";
import { store } from "./store/store";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";
import VModal from "vue-js-modal"; // Could not resolve dependency: npm ERR! peer vue@"2.6.11" from vue-js-modal@2.0.0-rc.6
import { BootstrapVue } from "bootstrap-vue";
import { VueSpinners } from "@saeris/vue-spinners";

import "./shared-style.css";

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(VModal, { dialog: true });
Vue.use(BootstrapVue);
Vue.use(VueSpinners);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
