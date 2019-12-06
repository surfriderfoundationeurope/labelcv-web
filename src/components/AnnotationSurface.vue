<template>
  <div
    :style="{'background-image': 'url(' + image + ')',}"
    @mousedown="onMouseDown"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    id="annotator-surface"
    ref="surface"
  >
    <div
      :class="{ axis: true, 'x-axis': true, 'hover-axis': hoverbox, }"
      :style="{ top: position.y + 'px' }"
      v-if="active"
    ></div>
    <div
      :class="{ axis:true, 'y-axis': true, 'hover-axis': hoverbox, }"
      :style="{ left: position.x + 'px' }"
      v-if="active"
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
import { Component, Vue } from "vue-property-decorator";
import ResizeObserver from "resize-observer-polyfill";

import { Event, BoundingBoxMoveEvent } from "../models/event";
import { Box, IdentifiableBox, Point, Size } from "../models/types";
import { eventService } from "../services/event";
import BoundingBox from "./BoundingBox.vue";

function newBoxId() {
  return (
    "_" +
    Math.random()
      .toString(36)
      .substr(2, 9)
  );
}

@Component({
  components: {
    BoundingBox
  }
})
export default class AnnotationSurface extends Vue {
  /** Boolean flag indicating if surface is active (hovered by mouse). */
  active: boolean = false;

  /** Boolean flag indicating if cursor is hovering a box. */
  hoverbox: boolean = false;

  /** Boolean flag indicating if a selection is active. */
  selection: boolean = false;

  /** Current relative position into the surface. */
  position: Point = {
    x: 0,
    y: 0
  };

  /** Established bounding box(es).  */
  // Note:  Map reactivity is not working but will be fully
  //        supported with Vue3. Consider upgrade when coming.
  //        To by pass we are using Map as box array reverse index.
  boxes: IdentifiableBox[] = [];
  boxIndex: Map<string, number> = new Map<string, number>();

  /** Bounding box user is currently building. */
  selectionPoint: Point = {
    x: 0,
    y: 0
  };

  /** URL of the currently annoted image. */
  image: string =
    "http://stmarkclinton.org/wp-content/uploads/2017/08/summer-rocks-trees-river.jpg";

  size?: Size;

  public mounted(): void {
    this.size = this.computeSurfaceSize();
    console.log(this.size);
    window.addEventListener("resize", this.onResize);
    eventService.on(Event.MOVE_BOX, this.onBoundingBoxMove);
  }

  /**
   *
   */
  private computeSurfaceSize(): Size | undefined {
    let surface = this.$refs.surface;
    if (surface instanceof HTMLElement) {
      return { width: surface.clientWidth, height: surface.clientHeight };
    }
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
    this.size = this.computeSurfaceSize();
  }

  /**
   *
   */
  private onMouseLeave(): void {
    this.active = false;
    this.selection = false;
  }

  private onMouseEnter() {
    this.active = true;
  }

  /**
   * Handle surface resize by computing resize ratio
   * and apply it to every BoundingBox.
   *
   * Note: Consider migrate to ResizeObserver API through polyfill.
   * Note: Consider disabling current selection if any (shouldn't happen but still).
   */
  private onResize() {
    const newSize: Size | undefined = this.computeSurfaceSize();
    if (newSize && this.size) {
      const vector: Point = {
        x: newSize.width / this.size.width,
        y: newSize.height / this.size.height
      };
      for (const box of this.boxes) {
        box.data.x *= vector.x;
        box.data.y *= vector.y;
        box.data.width *= vector.x;
        box.data.height *= vector.y;
      }
      this.size = newSize;
    }
  }

  private onBoundingBoxMove(event: BoundingBoxMoveEvent): void {
    const id = event.box;
    const index = this.boxIndex.get(id);
    if (index != null) {
      this.hoverbox = true;
      this.selection = false;
      const holder = this.boxes[index];
      const box = holder.data;
      this.position.x = box.x + event.x;
      this.position.y = box.y + event.y;
    }
  }

  private createSelectionBox(): Box {
    return {
      x: Math.min(this.position.x, this.selectionPoint.x),
      y: Math.min(this.position.y, this.selectionPoint.y),
      width: Math.abs(this.position.x - this.selectionPoint.x),
      height: Math.abs(this.position.y - this.selectionPoint.y)
    };
  }

  private onMouseDown(): void {
    this.selection = true;
    this.selectionPoint = {
      x: this.position.x,
      y: this.position.y
    };
  }

  private onMouseUp(): void {
    if (!this.hoverbox && this.selection) {
      let id = newBoxId();
      // Note: prevent from collision.
      while (this.boxIndex.has(id)) {
        id = newBoxId();
      }
      const index = this.boxes.push({
        id: id,
        data: this.createSelectionBox()
      });
      this.boxIndex.set(id, index - 1);
      this.selection = false;
    }
  }

  private onMouseMove(event: MouseEvent): void {
    if (event.target == this.$refs.surface) {
      this.position.x = event.offsetX;
      this.position.y = event.offsetY;
      this.hoverbox = false;
      eventService.emit(Event.MOVE_SURFACE, this.position);
    }
  }

  private onBoundingBoxSelect(): void {
    // TODO: Implements.
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