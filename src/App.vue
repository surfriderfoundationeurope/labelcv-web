<template>
  <div id="app">
    <Navbar />
    <b-container fluid id="router-view-container">
      <transition :name="transitionSide" mode="out-in">
        <router-view />
      </transition>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Navbar from "./components/general/Navbar.vue";

@Component({
  components: {
    Navbar,
  },
})
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
.header-link {
  text-decoration: none;
}
#router-view-container {
  height: 78%;
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
