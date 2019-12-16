<template>
  <div id="app">
    <div id="header">
      <div class="header-brand">Plastic Origin</div>
      <ul class="header-navigation">
        <li>
          <router-link to="/">About</router-link>
        </li>
        <li>
          <router-link to="/upload">Upload</router-link>
        </li>
        <li>
          <router-link to="/annotate">Annotate</router-link>
        </li>
      </ul>
    </div>
    <div id="router-view-container">
      <transition :name="transitionSide" mode="out-in">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class App extends Vue {
  private transitionSide: string = 'slide-right';

  private beforeRouteUpdate(to: any, from: any, next: any): void {
    this.transitionSide = to.order < from.order ? 'slide-right' : 'slide-left';
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
}

#router-view-container {
  width: 94%;
  height: 78%;
  margin: 0% 3% 0% 3%;
}

#header {
  display: flex;
  justify-content: space-between;
  width: 94%;
  height: 5%;
  margin: 3% 3%;
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


.header-brand {
  font-weight: 900;
}

.header-navigation {
  margin: 0;
}

.header-navigation li {
  display: inline;
  padding-left: 15px;
}

.header-navigation li a {
  color: white;
  font-size: 10pt;
  text-decoration: none;
  padding-bottom: 5px;
  border-bottom: 3px solid transparent;
}

.header-navigation li a:hover {
  color: white;
  padding-bottom: 6px;
  border-bottom: 1px solid white;
}

.header-navigation li a.router-link-exact-active,
.header-navigation li a.router-link-exact-active:hover {
  color: white;
  padding-bottom: 5px;
  border-bottom: 3px solid white;
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
