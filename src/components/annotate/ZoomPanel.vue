<template>
    <div id="zoom-panel-container">
        <div
            class="zoom-panel"
            :style="{
                'background-image': state.image.loaded
                    ? `url('${state.image.url}')`
                    : 'none',
                'background-position': `${viewportX}px ${viewportY}px`,
                'background-repeat': 'no-repeat'
            }"
            v-if="state.image.loaded && !state.selectedBoxUid"
        >
            <div class="axis x-axis" v-if="state.image.loaded"></div>
            <div class="axis y-axis" v-if="state.image.loaded"></div>
            <div id="zoom-panel-coordinates" v-if="state.image.loaded">
                {{ state.relativeCursor.x }},
                {{ state.relativeCursor.y }}
            </div>
        </div>
        <!-- TODO: it would be nice to only display  the trash box when selected (with correct width/height) -->
        <div
            class="zoom-panel"
            :style="{
                'background-image': state.image.loaded
                    ? 'url(' + state.image.url + ')'
                    : 'none',
                'background-position': `-${box.x - 2}px -${box.y - 5}px`,
                'background-repeat': 'no-repeat'
            }"
            v-if="state.image.loaded && state.selectedBoxUid"
        ></div>
        <div id="zoom-panal-state" v-if="!state.image.loaded">
            Loading image from server
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { State } from "@/store/store";
import { Box, Size } from "@/models";

@Component({})
export default class ZoomPanel extends Vue {
    private readonly size: Size = { width: 0, height: 0 };

    get state() {
        return this.$store.state as State;
    }
    get viewportX(): number {
        return this.size.width / 2 - this.$store.state.relativeCursor.x;
    }

    get viewportY(): number {
        return this.size.height / 2 - this.$store.state.relativeCursor.y;
    }
    get box(): Box {
        const box = this.$store.getters.getAnnotationByUid(
            this.$store.state.selectedBoxUid
        ).box;
        return box;
    }

    private mounted() {
        this.size.width = this.$el.clientWidth;
        this.size.height = this.$el.clientHeight;
    }
}
</script>

<style scoped>
#zoom-panel-container {
    width: 400px;
    height: 300px;
}

.zoom-panel {
    width: 100%;
    height: 100%;
}

#zoom-panel-coordinates {
    padding-left: 5%;
    background-color: rgba(100, 100, 100, 0.5);
    color: rgba(234, 234, 32, 0.7);
}

#zoom-panal-state {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
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
