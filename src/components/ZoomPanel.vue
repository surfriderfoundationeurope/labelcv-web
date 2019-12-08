<template>
  <div id="zoom-panel" ref="zoom">
    <img ref="loader" class="image-loader" />
    <div class="axis x-axis"></div>
    <div class="axis y-axis"></div>
    <div id="zoom-panel-coordinates">
      {{ offset.x }}, {{ offset.y }}
    </div>
    <div v-if="!active">
        Display message here when not active :).
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component, Mixin, Mixins } from 'vue-mixin-decorator';

import { Event } from "../models/event";
import { eventService } from "../services/event";

import Point from '@/models/geometry/point';
import Size  from '@/models/geometry/size';

import BackgroundImageMixin from './annotate/background.mixin';

@Component({})
export default class ZoomPanel extends Mixins<BackgroundImageMixin>(BackgroundImageMixin) {

    /** */
    private active: boolean = true;

    /** Image relative cursor offset. */
    private offset: Point = { x: 0, y: 0 };

    private mounted(): void {
        eventService.on(Event.MOVE_SURFACE, this.onSurfaceMove);
        this.onBackgroundElementMounted(this.$refs.zoom as HTMLElement);
        this.onBackgroundLoaderMounted(this.$refs.loader as HTMLImageElement);
        // Note: Test image.
        this.loadImage('http://stmarkclinton.org/wp-content/uploads/2017/08/summer-rocks-trees-river.jpg');
    }

    /**
     * 
     */
    private onSurfaceActive() {
        this.active = true;
    }

    /**
     * 
     */
    private onSurfaceMove(offset: Point): void {
        this.offset.x = Math.round(offset.x);
        this.offset.y = Math.round(offset.y);
        this.applyViewport(offset);
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