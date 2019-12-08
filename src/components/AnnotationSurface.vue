<template>
  <div
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    id="annotator-surface"
    ref="surface">
    <div id="loader-animation" v-if="!imageReady">
        <GridLoader color="white" />
    </div>
    <img ref="loader" class="image-loader" />
    <div
      :class="{ axis: true, 'x-axis': true, 'hover-axis': hoverbox, }"
      :style="{ top: cursor.y + 'px' }"
      v-if="active && imageReady"
    ></div>
    <div
      :class="{ axis:true, 'y-axis': true, 'hover-axis': hoverbox, }"
      :style="{ left: cursor.x + 'px' }"
      v-if="active && imageReady"
    ></div>
    <div
      :class="{ axis: true, 'x-axis': true, 'hover-axis': hoverbox, }"
      :style="{ top: selectionPoint.y + 'px' }"
      v-if="selection"
    ></div>
    <div
      :class="{ axis:true, 'y-axis': true, 'hover-axis': hoverbox, }"
      :style="{ left: selectionPoint.x + 'px' }"
      v-if="selection"
    ></div>
    <BoundingBox :box="box.data" :id="box.id" :key="box.id" v-for="box in boxes" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Mixin, Mixins } from 'vue-mixin-decorator';
import { GridLoader } from '@saeris/vue-spinners';

import { Event, BoundingBoxMoveEvent } from "../models/event";
import { Box, IdentifiableBox } from "../models/types";
import { eventService } from "../services/event";
import BoundingBox from "./BoundingBox.vue";

import Point from '@/models/geometry/point';
import Size from '@/models/geometry/size';

import BackgroundImageMixin from './background/background.mixin';

@Component({
  components: {
    BoundingBox,
    GridLoader,
  }
})
export default class AnnotationSurface extends Mixins<BackgroundImageMixin>(BackgroundImageMixin) {
  /** Boolean flag indicating if surface is active (hovered by mouse). */
  active: boolean = false;

  /** Boolean flag indicating if cursor is hovering a box. */
  hoverbox: boolean = false;

  /** Boolean flag indicating if a selection is active. */
  selection: boolean = false;

  /** Current relative position into the surface. */
  private readonly cursor: Point = {
    x: 0,
    y: 0
  };

  /** Established bounding box(es).  */
  // Note:  Map reactivity is not working but will be fully
  //        supported with Vue3. Consider upgrade when coming.
  //        To by pass we are using Map as box array reverse index.
  boxes: IdentifiableBox[] = [];
  boxIndex: Map<string, number> = new Map<string, number>();

  /** Bounding box user is currently hovering. */
  hoveredBox?: string; 

  /** Bounding box user is currently building. */
  selectionPoint: Point = {
    x: 0,
    y: 0
  };

  /** URL of the currently annoted image. */
  image: string = "";

  /**
   * 
   */
  public mounted(): void {
    this.onBackgroundElementMounted(this.$refs.surface as HTMLElement);
    this.onBackgroundLoaderMounted(this.$refs.loader as HTMLImageElement);
    this.addResizedMoveEventListener(this.onResizedMove);
    this.addMoveEventListener(this.onMove);
    // Note: Test image.
    this.onImageLoad('http://stmarkclinton.org/wp-content/uploads/2017/08/summer-rocks-trees-river.jpg');
  }

  /**
   * Mouse move event listener with position relative
   * to client coordinate system (effectivly displayed background).
   *
   * @param offset Cursor offset relative to this component origin.
   */
  private onMove(offset: Point): void {
    this.cursor.x = offset.x;
    this.cursor.y = offset.y;      
  }

  /**
   *
   * @param offset Cursor offset relative to the target image real size.
   */
  private onResizedMove(offset: Point): void {
      eventService.emit(Event.MOVE_SURFACE, offset);
      // TODO: Check for bb as well.
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
    this.boxIndex.clear();
    this.image = image;
    this.loadImage(image);
  }

  /** Desactivate surface when leaved. */
  private onMouseLeave(): void {
    this.active = false;
    this.selection = false;
  }

  /** Activate surface when hovered. */
  private onMouseEnter() {
    this.active = true;
  }

}
</script>

<style scoped>
#annotator-surface {
  position: relative;
  width: 67%;
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

.axis {
  z-index: 9;
  position: absolute;
  background: yellow;
}

.hover-axis {
  background: red !important;
}

.x-axis {
  left: 0;
  width: 100%;
  height: 1px;
}

.y-axis {
  top: 0;
  width: 1px;
  height: 100%;
}
</style>