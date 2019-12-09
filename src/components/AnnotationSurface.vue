<template>
  <div
    @mouseup="onMouseUp"
    @mousedown="onMouseDown"
    @mouseleave="onMouseLeave"
    id="annotator-surface"
    ref="surface">
    <div id="loader-animation" v-if="!imageReady">
      <GridLoader color="white" />
    </div>
    <img ref="loader" class="image-loader"/>
    <div id="boundingbox-container" ref="boundingboxContainer"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Mixin, Mixins } from 'vue-mixin-decorator';
import { GridLoader } from '@saeris/vue-spinners';

import Box from '@/models/geometry/box';
import Point from '@/models/geometry/point';
import Size from '@/models/geometry/size';

import { Event } from '@/models/event';
import { eventService } from '@/services/event';

import BackgroundImageMixin from './annotate/background.mixin';
import BoundingBox from './annotate/boundingbox';

@Component({
  components: {
    GridLoader,
  }
})
export default class AnnotationSurface
    extends Mixins<BackgroundImageMixin>(BackgroundImageMixin) {

  /** Current relative position into the surface. */
  private readonly cursor: Point = { x: 0, y: 0, };

  /** */
  private readonly resizedCursor: Point = { x: 0, y: 0, }

  /** Established bounding box(es).  */
  private boxes: BoundingBox[] = [];

  /** Boolean flag indicating if a selection is active. */
  private isSelecting: boolean = false;

  /** Current selection. */
  private selection?: Box;

  /** URL of the currently annoted image. */
  private image: string = '';

  /**
   *
   */
  public mounted(): void {
    this.onResizableElementReady(this.$refs.surface as HTMLElement);
    this.onBackgroundLoaderReady(this.$refs.loader as HTMLImageElement);
    this.withResizableElement((resizableElement) => {
        resizableElement.addEventListener('mousemove', this.onMouseMove);
        resizableElement.addEventListener('resizedmousemove', this.onResizedMouseMove);
    });
    // Note: Test image.
    this.onImageLoad(
      'http://stmarkclinton.org/wp-content/uploads/2017/08/summer-rocks-trees-river.jpg'
    );
  }


  private addBox(box: Box): void {
    const boundingBox = new BoundingBox();
    const index = this.boxes.push(boundingBox);
    this.withResizableElement((resizableElement) => {
        boundingBox.configure(
            box,
            resizableElement);
    });
  }

  /**
   * Action listener for new annotation image loading.
   * Reset state of this component and configure surface background
   * with given image URL.
   *
   * @param image URL of the loaded image.
   */
  private onImageLoad(image: string): void {
    this.boxes = [];
    this.image = image;
    this.loadImage(image);
  }

  /**
   * Mouse move event listener with position relative
   * to client coordinate system (effectivly displayed background).
   *
   * @param offset Cursor offset relative to this component origin.
   */
  private onMouseMove(offset: Point): void {
    this.cursor.x = offset.x;
    this.cursor.y = offset.y;
  }

  /**
   *
   * @param offset Cursor offset relative to the target image real size.
   */
  private onResizedMouseMove(offset: Point): void {
    this.resizedCursor.x = offset.x;
    this.resizedCursor.y = offset.y;
    eventService.emit(Event.MOVE_SURFACE, offset);
    if (this.isSelecting && this.selection) {
      this.selection.width = offset.x - this.selection.x;
      this.selection.height = offset.y - this.selection.y;
    }
  }

  /** Desactivate surface when leaved. */
  private onMouseLeave(): void {
    this.isSelecting = false;
  }

  /**
   *
   */
  private onMouseDown(event: MouseEvent): void {
    // Note:  prevent cursor to be set in drag mode
    //        and thus having inappropriate icon.
    event.preventDefault();
    this.selection = {
      width: 0,
      height: 0,
      x: this.resizedCursor.x,
      y: this.resizedCursor.y,
    }
    this.isSelecting = true;
  }

  /**
   * 
   */
  private onMouseUp(event: MouseEvent): void {
    if (this.isSelecting && this.selection) {
      const box = {
        width: this.selection.width,
        height:  this.selection.height,
        x: this.selection.x,
        y: this.selection.y,
      }
      // TODO: Compare with threshold instead (@see #12).
      if (box.width < 0) {
        box.x += box.width;
        box.width = Math.abs(box.width);
      }
      // TODO: Compare with threshold instead (@see #12).
      if (box.height < 0) {
        box.y += box.height;
        box.height = Math.abs(box.height);
      }
      this.addBox(box);
      this.selection = undefined;
      this.isSelecting = false;
    }
  }

}
</script>

<style>
.bounding-box {
  position: absolute;
  border: 1px solid greenyellow;
}

.bounding-box:focus {
  border: 1px solid rgb(105, 40, 13);
}
</style>

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