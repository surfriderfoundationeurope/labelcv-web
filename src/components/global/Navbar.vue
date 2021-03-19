<template>
    <b-navbar toggleable="sm" type="dark" class="navbar">
        <b-navbar-brand class="navbar-brand">
            <img src="images/surfrider.svg" alt="surfrider-logo" class="logo" />
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item href="/">
                    <router-link to="/">Annotate</router-link>
                </b-nav-item>
                <b-nav-item>
                    <router-link to="/tutorial">Tutorial</router-link>
                </b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class NavBar extends Vue {}
</script>

<style scoped>
.navbar {
    position: fixed;
    padding-top: 0;
    padding-bottom: 0;
    z-index: 2;
    font-size: 1.3rem;
}

.navbar li a {
    text-decoration: none;
    color: silver;
}

.navbar li a.router-link-exact-active,
a.router-link-exact-active:hover {
    color: white;
    text-decoration: none;
    padding-bottom: 2%;
    border-bottom: 1px solid white;
    font-weight: bold;
}

.logo {
    box-sizing: content-box;
    width: 70%;
}

a {
    text-shadow: 0px 1px 1px black;
}
</style>
