<template>
  <div id="app">
    <Navbar />
    <div id="router-view-container">
      <transition :name="transitionSide" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import Navbar from "./components/global/Navbar.vue";

@Component({ components: { Navbar } })
export default class App extends Vue {
  private transitionSide: string = "slide-right";

  private beforeRouteUpdate(to: any, from: any, next: any): void {
    this.transitionSide = to.order < from.order ? "slide-right" : "slide-left";
    next();
  }
}
</script>

<style>
#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  color: white;
  background: black;
}

#router-view-container {
  width: 94%;
  height: 78%;
  margin: 0 1rem;
}

img.mx-auto {
  bottom: 2px;
  margin: 50% 10% 2% 10%;
  width: 80%;
}

.image-loader {
  display: none;
}

.v--modal-box {
  color: rgb(50, 50, 50);
}

.v--modal-overlay {
  background: rgba(0, 0, 0, 0.6) !important;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition-duration: 0.5s;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
  overflow: hidden;
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  transform: translate(2em, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  transform: translate(-2em, 0);
}
</style>
