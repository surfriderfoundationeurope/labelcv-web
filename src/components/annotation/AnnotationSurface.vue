<template>
  <div
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mousedown="onMouseDown"
    @mouseleave="onMouseLeave"
    id="annotator-surface"
    :style="{'background-image': state.imageLoaded ? `url(${state.image})` : 'none',}">
    <div id="loader-animation" v-if="!state.imageLoaded">
      <GridLoader color="white" />
    </div>
    <BoundingBox :id="id - 1" :key="id" v-for="id in state.boxes.length" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators';

import AnnotationStore from '@/store/store.annotation';

import Box from '@/models/geometry/box';
import Point from '@/models/geometry/point';
import Size from '@/models/geometry/size';

import { GridLoader } from '@saeris/vue-spinners';
import BoundingBox from './BoundingBox.vue';

@Component({
  components: {
    BoundingBox,
    GridLoader,
  },
})
export default class AnnotationSurface extends Vue {

  /** */
  private readonly state: AnnotationStore = getModule(AnnotationStore);

  /** Current relative position into the surface. */
  private readonly relativeCursor: Point = { x: 0, y: 0 };

  /** Boolean flag indicating if a drawed is active. */
  private drawing: boolean = false;

  /** Current drawed. */
  private drawed?: Box;

  public mounted(): void {
    window.addEventListener('resize', () => {
      this.state.updateRatio(this.$el as HTMLElement);
    });
    this.state.loadImage(
      'http://stmarkclinton.org/wp-content/uploads/2017/08/summer-rocks-trees-river.jpg');
  }

  /**
   * Mouse move event listener with position relative
   * to client coordinate system (effectivly displayed background).
   *
   * @param offset Cursor offset relative to this component origin.
   */
  private onMouseMove(event: MouseEvent): void {
    const relativeCursor = {
      x: event.offsetX * this.state.imageRatio.width,
      y: event.offsetY * this.state.imageRatio.height,
    };
    this.state.updateRelativeCursor(relativeCursor);
    if (this.drawing && this.drawed) {
      this.drawed.width = relativeCursor.x - this.drawed.x;
      this.drawed.height = relativeCursor.y - this.drawed.y;
    }
  }

  /** Desactivate surface when leaved. */
  private onMouseLeave(event: MouseEvent): void {
    if (this.$el === event.target) {
      this.drawing = false;
    }
  }

  /**
   *
   */
  private onMouseDown(event: MouseEvent): void {
    if (this.$el === event.target) {
      event.preventDefault();
      this.drawing = true;
      this.drawed = {
        width: 0,
        height: 0,
        x: this.state.relativeCursor.x,
        y: this.state.relativeCursor.y };
    }
  }

  /**
   *
   */
  private onMouseUp(event: MouseEvent): void {
    if (this.$el === event.target && this.drawing && this.drawed) {
      const box = {
        width: this.drawed.width,
        height:  this.drawed.height,
        x: this.drawed.x,
        y: this.drawed.y,
      };
      if (box.width < 0) {
        box.x += box.width;
      }
      if (box.height < 0) {
        box.y += box.height;
      }
      box.width = Math.abs(box.width);
      box.height = Math.abs(box.height);
      this.state.addAnnotation(box);
      this.drawed = undefined;
      this.drawing = false;
    }
  }

}
</script>

<style scoped>
#annotator-surface {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgb(60, 60, 60);
  border: 1px solid rgb(25, 25, 25);
  background-color: rgb(70, 70, 70);
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 100% 100% !important;
}

#loader-animation {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.image-loader {
  display: none;
}

#annotator-surface,
#annotator-surface:hover {
  cursor: crosshair;
}

#annotator-surface:focus {
  cursor: crosshair;
}
#annotator-surface:active {
  cursor: crosshair;
}
</style>