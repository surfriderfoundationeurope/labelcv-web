<template>
    <div id="app">
        <div id="header">
            <div class="header-brand">
                <div class="logo" style="left: 5%">

                    <a href='/'>
                        <img src='../public/surfrider.svg'
                             class="mx-auto"
                             alt='surfrider-logo'>
                    </a>
                </div>
            </div>
            <ul class="header-navigation">
                <li>
                    <router-link to="/annotate">Annotate</router-link>
                </li>
                <li>
                    <router-link to="/">About</router-link>
                </li>
                <li>
                    <router-link to="/upload">Upload</router-link>
                </li>
            </ul>
        </div>
        <div id="router-view-container">
            <transition :name="transitionSide" mode="out-in">
                <router-view/>
            </transition>
        </div>
    </div>
</template>

<script lang="ts">

    import {Component, Vue} from 'vue-property-decorator';

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
        background: black;
    }

    #router-view-container {
        width: 94%;
        height: 78%;
        margin: 0% 3% 0% 3%;
    }

    #header {
        display: flex;
        justify-content: space-between;
        margin-left:11%;
        float: left
    }


    img.mx-auto {
        bottom: 2px;
        margin: 50% 10% 2% 10%;
        width: 80%;
    }

    .logo {
        background-color: #0073be;
        -moz-border-radius: 0 0 3px 3px;
        -webkit-border-radius: 0 0 3px 3px;
        border-radius: 0 0 3px 3px;
        position: absolute;
        z-index: 1;
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
        margin-top: 4%;
    }

    .header-navigation li {
        display: inline;
        padding-left: 10px;
    }

    .header-navigation li a {
        color: white;
        font-size: 20px;
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
