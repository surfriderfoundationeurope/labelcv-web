<template>
  <div id="zoom-panel-container">
    <div
      class="zoom-panel"
      :style="{
        'background-image': state.imageLoaded
          ? 'url(' + state.image + ')'
          : 'none',
        'background-position': `${viewportX}px ${viewportY}px`,
        'background-repeat': 'no-repeat',
      }"
      v-if="state.imageLoaded && isNaN(state.selectedAnnotation)"
    >
      <div class="axis x-axis" v-if="state.imageLoaded"></div>
      <div class="axis y-axis" v-if="state.imageLoaded"></div>
      <div id="zoom-panel-coordinates" v-if="state.imageLoaded">
        {{ state.relativeCursor.x }},
        {{ state.relativeCursor.y }}
      </div>
    </div>
    <div
      class="zoom-panel"
      :style="{
        'background-image': state.imageLoaded
          ? 'url(' + state.image + ')'
          : 'none',
        'background-position': `-${
          state.annotations[state.selectedAnnotation].box.x
        }px -${state.annotations[state.selectedAnnotation].box.y}px`,
        'background-repeat': 'no-repeat',
      }"
      v-if="state.imageLoaded && !isNaN(state.selectedAnnotation)"
    ></div>
    <div id="zoom-panal-state" v-if="!state.imageLoaded">Loading image from server</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators';

import AnnotationStore from '@/store/store.annotation';
import Point from '@/models/geometry/point';
import Size from '@/models/geometry/size';

@Component({})
export default class ZoomPanel extends Vue {
  /** */
  private readonly state: AnnotationStore = getModule(AnnotationStore);

  /** */
  private readonly size: Size = { width: 0, height: 0 };

  get viewportX(): number {
    return this.size.width / 2 - this.state.relativeCursor.x;
  }

  get viewportY(): number {
    return this.size.height / 2 - this.state.relativeCursor.y;
  }

  private mounted() {
    this.size.width = this.$el.clientWidth;
    this.size.height = this.$el.clientHeight;
  }
}
</script>

<style scoped>
#zoom-panel-container {
  width: 400px;
  height: 300px;
}

.zoom-panel {
  width: 100%;
  height: 100%;
}

#zoom-panel-coordinates {
  padding-left: 5%;
  background-color: rgba(100, 100, 100, 0.5);
  color: rgba(234, 234, 32, 0.7);
}

#zoom-panal-state {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
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
