<template>
  <div id="app">
    <div id="header">
      <div class="header-brand">
          Plastic Origin
      </div>
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
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Upload from './views/Upload.vue';

@Component({
  components: {
    Upload,
  },
})
export default class App extends Vue {}
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

#header {
  display: flex;
  justify-content: space-between;
  width: 94%;
  height: 5%;
  padding: 3% 3%;
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
</style>
