<template>
  <b-navbar toggleable="sm" type="dark" class="navbar">
    <b-navbar-brand class="logo-bg">
      <img src="surfrider.svg" alt="surfrider-logo" class="logo" />
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item>
          <router-link to="/annotate">Annotate</router-link>
        </b-nav-item>
        <b-nav-item href="/">
          <router-link to="/">About</router-link>
        </b-nav-item>
        <b-nav-item href="/upload">
          <router-link to="/upload">Upload</router-link>
        </b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown right no-caret>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <b-avatar />
          </template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { getModule } from "vuex-module-decorators";

@Component({
  components: {},
})
export default class Annotate extends Vue {}
</script>

<style scoped>
.navbar {
  padding-top: 0;
  padding-bottom: 0;
}

.navbar li a {
  text-decoration: none;
  color: #7f7f7f;
}

.navbar li a.router-link-exact-active,
a.router-link-exact-active:hover {
  color: white;
  text-decoration: none;
  padding-bottom: 2%;
  border-bottom: 1px solid white;
}

.logo-bg {
  background-color: #0073be;
  display: flex;
  width: 50px;
  padding: 2% 0.5% 0.5% 0.5%;
}
.logo {
  box-sizing: content-box;
  width: 100%;
}
/*
*/
</style>
