<template>
  <div
    class="bounding-box"
    ref="self"
    v-bind:style="{top: box.y + 'px', left: box.x + 'px', width: box.width + 'px', height: box.height + 'px',}"
    @mousemove="onMouseMove"
  ></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Event } from '../models/event';
import { eventService } from '../services/event';

@Component({ props: ['id', 'box'] })
export default class BoundingBox extends Vue {
  public onMouseMove(event: MouseEvent) {
    if (event.target == this.$refs.self) {
      eventService.emit(Event.MOVE_BOX, {
        box: this.$props.id,
        x: event.offsetX,
        y: event.offsetY,
      });
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
