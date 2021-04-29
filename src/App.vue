<template>

    <div class="app" v-if='isDesktop'>
      <Navbar />
      <div id="router-view-container">
        <transition :name="transitionSide" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
    <div class="app" id="desktop-only" v-else>
      <p>La plateforme <strong>Trashroulette</strong> n’est utilisable que sur <strong>ordinateur</strong>. 
      <br/>
      Nous avons fait ce choix pour permettre une labélisation des images plus efficace et de meilleure qualité. 
      <br/>
      Merci de vous connecter depuis un ordinateur.</p>
      <p>~</p>
      <p>The <strong>Trashroulette</strong> platform can only be used from a <strong>computer</strong>. 
        <br>
        We made this choice to ensure a better quality and accuracy of the labeling. 
        <br>
        Please, access it from a computer.</p>
    </div>

</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import { getModule } from 'vuex-module-decorators';
import AnnotationStore from '@/store/store.annotation';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Navbar from './components/global/Navbar.vue';
import axios from 'axios';

@Component({ components: { Navbar } })
export default class App extends Vue {
  private transitionSide: string = 'slide-right';
  private isDesktop: boolean = false;
  private readonly state: AnnotationStore = getModule(AnnotationStore);

  private created(): void {
    // get window size
     window.addEventListener('resize', this.handleDesktopOnly);
     this.handleDesktopOnly();
     axios.get('config.prod.json').then((response: { data: { url: string; }; }) => {
      this.state.setURL(response.data.url);
    }).catch((prodError) => {
      // eslint-disable-next-line no-console
      console.log(prodError);
      axios.get('config.dev.json').then((response: { data: { url: string; }; }) => {
        this.state.setURL(response.data.url);
      }).catch((devError) => {
      // eslint-disable-next-line no-console
        console.log(devError);
      });
    });
     setTimeout(this.state.fetchState, 6000);


  }

  private beforeRouteUpdate(to: any, from: any, next: any): void {
    this.transitionSide = to.order < from.order ? 'slide-right' : 'slide-left';
    next();
  }

  private destroy(): void {
      window.removeEventListener('resize', this.handleDesktopOnly);
  }

  private handleDesktopOnly(): void {
    window.innerWidth < 961 ? this.isDesktop = false : this.isDesktop = true;
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

#router-view-container {
  width: 94%;
  height: 78%;
  margin: 0 1rem;
  margin-top:4.6rem;
}

#desktop-only {
  width:100vw;
  height:100vh;
  text-align:center;
  padding:2rem;
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
