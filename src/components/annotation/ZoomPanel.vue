<template>
  <div
      id="zoom-panel"
      ref="zoom"
      :style="{
        'background-image': state.imageLoaded ? 'url(' + state.image + ')' : 'none',
        'background-position': `-${viewportX}px -${viewportY}px`,
      }">
    <div class="axis x-axis"></div>
    <div class="axis y-axis"></div>
    <div id="zoom-panel-coordinates">
      {{ state.relativeCursor.x }},
      {{ state.relativeCursor.y }}
    </div>
    <div v-if="!state.imageLoaded">
        Display message here when not active :).
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators'

import AnnotationStore from '@/store/store.annotation';
import Point from '@/models/geometry/point';

@Component({})
export default class ZoomPanel extends Vue {

  /** */
  private readonly state: AnnotationStore = getModule(AnnotationStore);

  get viewportX(): number {
    return this.state.relativeCursor.x; // - this.$el.clientWidth / 2;
  }

  get viewportY(): number {
    return this.state.relativeCursor.y; // - this.$el.clientHeight / 2;
  }

}
</script>

<style scoped>
#zoom-panel {
  width: 100%;
  height: 100%;
}

#zoom-panel-coordinates {
  padding-left: 5%;
  background-color: rgba(100, 100, 100, 0.5);
  color: rgba(234, 234, 32, 0.7);
}

.axis {
  z-index: 9;
  position: relative;
  background: rgba(234, 234, 32, 0.5);
}

.hover-axis {
  background: red !important;
}

.x-axis {
  top: 50%;
  left: 5%;
  width: 90%;
  height: 1px;
}

.y-axis {
  top: 5%;
  left: 50%;
  width: 1px;
  height: 90%;
}
</style>