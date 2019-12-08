<template>
  <div
    class="bounding-box"
    ref="self"
    v-bind:style="{
      top: offset.y + 'px',
      left: offset.x + 'px',
      width: offset.width + 'px',
      offset: box.height + 'px',}">
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component, { mixins } from 'vue-class-component'

import Box from '../models/geometry/box';
import Point from '../models/geometry/point';
import Size from '../models/geometry/size';

import ResizableElement from './annotate/resizable.element';
import { ResizedChildSupport, ResizedEventSupport } from './annotate/resizable.support';

@Component({
  props: ['id', 'box', 'holder'],
})
export default class BoundingBox extends Vue {

  private boxId?: number;

  private boxData?: Box;

  private offset: Point = { x: 0, y: 0, };

  private size: Size = { width: 0, height: 0, };

  mounted() {
    // Transfer props to data with cast.
    this.boxId = this.$props.id as number;
    this.boxData = this.$props.box as Box;
    // Register itself as a child.
    console.log(this.$props.support);
    const support = this.$props.support as ResizedEventSupport;
    support.addResizedEventListener(this.onRatioChange);
  }

  public onRatioChange(ratio: Size): void {
    if (this.boxData) {
      this.offset.x = ratio.width * this.boxData.x;
      this.offset.y = ratio.width * this.boxData.y;
      this.size.width = ratio.width * this.boxData.width
      this.size.height = ratio.width * this.boxData.height;
    }
  }

}
</script>

<style scoped>
.bounding-box {
  position: absolute;
  border: 1px solid greenyellow;
}
</style>
