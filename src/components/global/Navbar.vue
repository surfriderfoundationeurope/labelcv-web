<template>
    <b-navbar toggleable="sm" type="dark" class="navbar w-100">
        <b-navbar-brand class="navbar-brand">
            <img src="images/surfrider.svg" alt="surfrider-logo" class="logo" />
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" class="w-100" is-nav>
            <b-navbar-nav class="d-flex align-items-center w-100">
                <b-nav-item href="/">
                    <router-link to="/">Annotate</router-link>
                </b-nav-item>
                <b-nav-item>
                    <router-link to="/tutorial">Tutorial</router-link>
                </b-nav-item>
                <b-nav-item v-if="isLoggedIn">
                    <router-link to="/upload">Upload</router-link>
                </b-nav-item>
                <b-nav-item v-if="isLoggedIn" class="ml-auto">
                    <b-button variant="outline-primary" @click="logout">
                        Logout
                    </b-button>
                </b-nav-item>
                <b-nav-item v-if="!isLoggedIn" class="ml-auto">
                    <router-link to="/login">Login</router-link>
                </b-nav-item>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mapGetters, mapMutations } from "vuex";

@Component({
    computed: {
        ...mapGetters(["isLoggedIn"])
    },
    methods: {
        ...mapMutations(["logout"])
    }
})
export default class NavBar extends Vue {}
</script>

<style scoped>
.navbar {
    position: fixed;
    padding-top: 0;
    padding-bottom: 0;
    z-index: 2;
    font-size: 1rem;
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
    width: 50%;
}

a {
    text-shadow: 0px 1px 1px black;
}
</style>
