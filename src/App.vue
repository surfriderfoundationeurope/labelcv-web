<template>
    <div class="app" v-if="isDesktop">
        <div id="overlay-classification-container">
            <div id="overlay-classification">
                <span class="close-icon" @click="hideOverlayClassification()"
                    >x</span
                >
                <img src="/images/classification.png" />
            </div>
        </div>
        <Navbar />
        <div id="router-view-container">
            <transition :name="transitionSide" mode="out-in">
                <router-view />
            </transition>
        </div>
    </div>
    <div class="app" id="desktop-only" v-else>
        <p>
            La plateforme <strong>Trashroulette</strong> n’est utilisable que
            sur <strong>ordinateur</strong>.
            <br />
            Nous avons fait ce choix pour permettre une labélisation des images
            plus efficace et de meilleure qualité.
            <br />
            Merci de vous connecter depuis un ordinateur.
        </p>
        <p>~</p>
        <p>
            The <strong>Trashroulette</strong> platform can only be used from a
            <strong>computer</strong>.
            <br />
            We made this choice to ensure a better quality and accuracy of the
            labeling.
            <br />
            Please, access it from a computer.
        </p>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import Navbar from "./components/global/Navbar.vue";
import axios from "axios";

@Component({ components: { Navbar } })
export default class App extends Vue {
    private transitionSide = "slide-right";
    private isDesktop = false;

    private created(): void {
        // get window size
        window.addEventListener("resize", this.handleDesktopOnly);
        this.handleDesktopOnly();
        this.$store.dispatch("configurateAPI");
        setTimeout(() => this.$store.dispatch("fetchState"), 6000);
    }

    private destroy(): void {
        window.removeEventListener("resize", this.handleDesktopOnly);
    }

    private handleDesktopOnly(): void {
        window.innerWidth < 961
            ? (this.isDesktop = false)
            : (this.isDesktop = true);
    }

    hideOverlayClassification() {
        const overlay = document.getElementById(
            "overlay-classification-container"
        ) as HTMLElement;
        overlay.style.display = "none";
    }
}
</script>

<style>
.app {
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

#overlay-classification-container {
    display: none;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 100;
    width: 100%;
    height: 100%;
}

#overlay-classification {
    display: flex;
    flex-direction: column;
    position: absolute;
    margin: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

#overlay-classification .close-icon {
    align-self: flex-end;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
}

#router-view-container {
    width: 94%;
    height: 78%;
    margin: 0 1rem;
    margin-top: 4.6rem;
}

#desktop-only {
    width: 100vw;
    height: 100vh;
    text-align: center;
    padding: 2rem;
    font-style: italic;
    display: flex;
    flex-direction: column;
    justify-content: center;
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
