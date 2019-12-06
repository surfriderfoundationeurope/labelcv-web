<template>
  <div
    :style="{'background-image': 'url(' + image + ')',}"
    @mousedown="onMouseDown"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @click="onMouseClick"
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

  /** Bounding box user is currently hovering. */
  hoveredBox?: string; 

  /** Bounding box user is currently building. */
  selectionPoint: Point = {
    x: 0,
    y: 0
  };

  /** URL of the currently annoted image. */
  image: string =
    "http://stmarkclinton.org/wp-content/uploads/2017/08/summer-rocks-trees-river.jpg";

  size?: Size;

  /**
   *
   */
  private computeSurfaceSize(): Size | undefined {
    let surface = this.$refs.surface;
    if (surface instanceof HTMLElement) {
      return { width: surface.clientWidth, height: surface.clientHeight };
    }
  }

  public mounted(): void {
    this.size = this.computeSurfaceSize();
    window.addEventListener("resize", this.onResize);
    eventService.on(Event.MOVE_BOX, this.onBoundingBoxMove);
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

  /** Desactivate surface when leaved. */
  private onMouseLeave(): void {
    this.active = false;
    this.selection = false;
  }

  /** Activate surface when hovered. */
  private onMouseEnter() {
    this.active = true;
  }

  /**
   * Handle surface resize by computing resize ratio and apply
   * it to every existing bounding boxes.
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

  /**
   * As we are handling cursor position tracking only through
   * mousemove event associated offset, we can't compute cursor
   * position when hovering a bounding box as it takes offset focus.
   *
   * With this listener method we apply caught bounding box cursor
   * movement offset and apply it to the parent surface.
   */
  private onBoundingBoxMove(event: BoundingBoxMoveEvent): void {
    const id = event.box;
    const index = this.boxIndex.get(id);
    if (index != null) {
      this.hoverbox = true;
      this.hoveredBox = id;
      this.selection = false;
      const holder = this.boxes[index];
      const box = holder.data;
      this.position.x = box.x + event.x;
      this.position.y = box.y + event.y;
    }
  }

  /**
   * Start area selection in order to create a new bounding
   * box. Such operation only occurs while not hovering an
   * existing bounding box.
   */
  private onMouseDown(event: MouseEvent): void {
    if (!this.hoverbox) {
      // Note:  prevent cursor to be set in drag mode
      //        and thus having inappropriate icon.
      event.preventDefault();
      this.selection = true;
      this.selectionPoint = {
        x: this.position.x,
        y: this.position.y
      };
    }
  }

  /**
   * Finalizer bounding box creation if appropriate.
   * First create a new unique identifier for the box,
   * compute final box data and index it internally.
   */
  private onMouseUp(): void {
    if (!this.hoverbox && this.selection) {
      let id = newBoxId();
      // Note: prevent from collision.
      while (this.boxIndex.has(id)) {
        id = newBoxId();
      }
      const index = this.boxes.push({
        id: id,
        data: {
          x: Math.min(this.position.x, this.selectionPoint.x),
          y: Math.min(this.position.y, this.selectionPoint.y),
          width: Math.abs(this.position.x - this.selectionPoint.x),
          height: Math.abs(this.position.y - this.selectionPoint.y)
        },
      });
      this.boxIndex.set(id, index - 1);
      // TODO: Trigger bounding box selection.
      this.selection = false;
    }
  }

  /**
   * Update current cursor position by using event offset
   * if the surface has the target focus.
   */
  private onMouseMove(event: MouseEvent): void {
    if (event.target == this.$refs.surface) {
      this.position.x = event.offsetX;
      this.position.y = event.offsetY;
      this.hoverbox = false;
      eventService.emit(Event.MOVE_SURFACE, this.position);
    }
  }

  /** Trigger a box selection if hovering. */
  private onMouseClick(): void {
    if (this.hoverbox && this.hoveredBox) {
      this.onBoundingBoxSelect(this.hoveredBox);
    }
  }

  private onBoundingBoxSelect(selected: string): void {
    // TODO: Send selected box as event.
    // TODO: Consider applying selection style to the box.
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