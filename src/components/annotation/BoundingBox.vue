<template>
  <div
      :id="`bounding-box-${id}`"
      :class="{
        'bounding-box': true,
        'bounding-box-labelled': labelled,
        'bounding-box-disabled': disabled,
        'bounding-box-selected': selected}"
      :style="{
        left: `${x - 2}px`, top: `${y - 5}px`,
        width: `${width + 4}px`, height: `${height + 9}px`, }"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @click="onMouseClick">
    <div class="bounding-box-header"></div>
    <div
        class="bounding-box-content"
        :style="{
          width: `${width}px`,
          height: `${height}px`, }"></div>
  </div>
</template>

<script lang="ts">
import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators';

import AnnotationStore from '@/store/store.annotation';

import Box from '@/models/geometry/box';
import Size from '@/models/geometry/size';

@Component({
  props: ['id', 'raw'],
})
export default class BoundingBox extends Vue {

  /** */
  private readonly state: AnnotationStore = getModule(AnnotationStore);

  /** */
  private hovered: boolean = false;

  get box(): Box {
    const id = this.$props.id;
    if (id === 'raw') {
      return this.$props.raw;
    }
    // TODO: boundaries control.
    return this.state.annotations[id].box;
  }
  get labelled(): boolean {
    return this.state.annotations[this.$props.id] != undefined
  }
  public get disabled(): boolean {
    return !this.sizeOK()
  }
  get selected(): boolean {
    return this.state.selectedAnnotation === this.$props.id;
  }

  get x(): number {
    return Math.round(
      this.state.imageReverseRatio.width * this.box.x);
  }

  get y(): number {
    return Math.round(
      this.state.imageReverseRatio.height * this.box.y);
  }

  get width(): number {
    return Math.round(
      this.state.imageReverseRatio.width * this.box.width);
  }

  get height(): number {
    return Math.round(
      this.state.imageReverseRatio.height * this.box.height);
  }

  private onMouseEnter(event: MouseEvent): void {
    if (this.$el === event.target) {
      this.hovered = true;
    }
  }

  private onMouseLeave(event: MouseEvent): void {
    if (this.$el === event.target) {
      this.hovered = false;
    }
  }

  private onMouseClick(event: MouseEvent): void {
    if (this.hovered) {
      this.state.select(this.$props.id);
    }
  }
  private sizeOK(): boolean {
    const limitSize = this.state.minTrashSize;
    return this.box.width >= limitSize && this.box.height >= limitSize
  }

}
</script>

<style scoped>
.bounding-box {
  position: absolute;
  cursor: pointer;
}

.bounding-box-header {
  height: 5px;
  width: 100%;
  background: greenyellow;
}

.bounding-box-content {
  border: 2px solid greenyellow;
}

.bounding-box-labelled  .bounding-box-header {
  background: darkgreen;
}

.bounding-box-labelled  .bounding-box-content {
  border: 2px solid darkgreen;
}

.bounding-box-disabled .bounding-box-header {
   background:  darkred;
}

.bounding-box-disabled .bounding-box-content {
   border: 2px solid darkred;
}

.bounding-box-selected .bounding-box-header {
  background: greenyellow;
}

.bounding-box-selected .bounding-box-content {
  border: 2px solid greenyellow;
}




</style>