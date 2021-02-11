<template>
  <div
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mousedown="onMouseDown"
    @mouseleave="onMouseLeave"
    id="annotator-surface"
    :style="{
      'background-image': state.imageLoaded ? `url('${state.image}')` : 'none',
      'cursor': isNaN(state.selectedAnnotation) ? 'crosshair' : 'not-allowed',
    }"
  >
    <div id="loader-animation" v-if="!state.imageLoaded">
      <GridLoader color="white" />
    </div>
    <BoundingBox :id="id - 1" :key="id" v-for="id in state.annotations.length" />
    <BoundingBox id="raw" ref="raw" :raw="drawed" v-if="drawing" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators';

import AnnotationStore from '@/store/store.annotation';

import Box from '@/models/geometry/box';
import Point from '@/models/geometry/point';

import { GridLoader } from '@saeris/vue-spinners';
import BoundingBox from './BoundingBox.vue';

@Component({
  components: {
    BoundingBox,
    GridLoader
  }
})
export default class AnnotationSurface extends Vue {
  /** */
  private readonly state: AnnotationStore = getModule(AnnotationStore);

  /** Current relative position into the surface. */
  private readonly relativeCursor: Point = { x: 0, y: 0 };

  /** Boolean flag indicating if a drawed is active. */
  private drawing: boolean = false;

  /** Current drawed. */
  private readonly drawed: Box = { x: NaN, y: NaN, width: NaN, height: NaN };

  private imageHolderClientWidth: number;
  private imageHolderClientHeight: number;

  public mounted(): void {
    window.addEventListener('resize', () => {
      const imageLoader = document.getElementsByClassName('image-loader')[0] as HTMLElement;

      // We have to briefly display the image loader to get dimensions on client screen
      imageLoader.style.display = 'inline-block';
      this.state.updateRatio(imageLoader);
      this.imageHolderClientWidth = imageLoader.clientWidth;
      this.imageHolderClientHeight = imageLoader.clientHeight;
      imageLoader.style.display = 'none';

      const annotatorSurface = document.getElementById('annotator-surface') as HTMLElement;
      const boxOffset: Point = {
        x: (annotatorSurface.offsetWidth / 2) - (this.imageHolderClientWidth / 2),
        y: (annotatorSurface.offsetHeight / 2) - (this.imageHolderClientHeight / 2)
      };
      this.state.updateBoxOffset(boxOffset);
    });
  }

  /**
   * Mouse move event listener with position relative
   * to client coordinate system (effectivly displayed background).
   *
   * @param offset Cursor offset relative to this component origin.
   */
  private onMouseMove(event: MouseEvent): void {
    const elem = this.$el as HTMLElement;
    const offset = {
      left: elem.offsetLeft + (elem.offsetWidth / 2) - (this.imageHolderClientWidth / 2),
      top: elem.offsetTop + (elem.offsetHeight / 2) - (this.imageHolderClientHeight / 2)
    };

    const cursor = {
      x: event.clientX,
      y: event.clientY
    };
    if (event.target instanceof BoundingBox) {
      console.log('Happend');
      const box = event.target as BoundingBox; // todo ?
      cursor.x += box.x * this.state.imageReverseRatio.width;
      cursor.y += box.y * this.state.imageReverseRatio.height;
    }
    const relativeCursor = {
      x: (cursor.x - offset.left) * this.state.imageRatio.width,
      y: (cursor.y - offset.top) * this.state.imageRatio.height
    };
    this.state.updateRelativeCursor(relativeCursor);
    if (this.drawing) {
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
    if (
      this.$el === event.target &&
      !this.drawing &&
      isNaN(this.state.selectedAnnotation)
    ) {
      event.preventDefault();
      this.drawed.width = 0;
      this.drawed.height = 0;
      this.drawed.x = this.state.relativeCursor.x;
      this.drawed.y = this.state.relativeCursor.y;
      this.drawing = true;
    }
  }

  /**
   *
   */
  private onMouseUp(event: MouseEvent): void {
    if (this.drawing) {
      this.drawing = false;
      const box = {
        width: this.drawed.width,
        height: this.drawed.height,
        x: this.drawed.x,
        y: this.drawed.y
      };
      const limitSize = this.state.minTrashSize;
      if (box.width > limitSize && box.height > limitSize) {
        console.log(this.drawed);
        this.state.addAnnotation(box);
      } else {
        console.log('Trash is too small');
      }
      this.drawed.width = NaN;
      this.drawed.height = NaN;
      this.drawed.x = NaN;
      this.drawed.y = NaN;
    } else {
      this.state.resetSelectedAnnotation();
    }
  }
}
</script>

<style scoped>
#annotator-surface {
  position: relative;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain !important;
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
</style>