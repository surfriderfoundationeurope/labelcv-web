<template>
    <div
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mousedown="onMouseDown"
        @mouseleave="onMouseLeave"
        id="annotation-surface-image"
        :style="{
            'background-image': $store.state.image.loaded
                ? `url('${$store.state.image.url}')`
                : 'none',
            cursor: !$store.state.selectedBoxUid ? 'crosshair' : 'not-allowed'
        }"
    >
        <div id="loader-animation" v-if="!$store.state.image.loaded">
            <GridLoader color="white" />
        </div>
        <BoundingBox
            :id="annotatedTrash.uid"
            :key="annotatedTrash.uid"
            v-for="annotatedTrash in $store.state.annotations"
        />

        <CrosshairGuide :cursor-information="cursorInformation" />
        <BoundingBox id="raw" ref="raw" :raw="drawed" v-if="drawing" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Box, Point } from "@/models";
import BoundingBox from "./BoundingBox.vue";
import CrosshairGuide from "./CrosshairGuide.vue";
import GridLoader from "vue-spinner/src/PulseLoader.vue";

@Component({
    components: {
        BoundingBox,
        GridLoader,
        CrosshairGuide
    }
})
export default class AnnotationSurface extends Vue {
    /** Current relative position into the surface. */
    private readonly relativeCursor: Point = { x: 0, y: 0 };

    /** Boolean flag indicating if a drawed is active. */
    private drawing = false;

    private cursorInformation = {
        cursor: { x: 0, y: 0 },
        elem: this.$el,
        offset: { left: 0, top: 0 }
    };
    /** Current drawed. */
    private readonly drawedMouseDown: Point = { x: NaN, y: NaN };
    private readonly drawed: Box = { x: NaN, y: NaN, width: NaN, height: NaN };
    private crossHeightShift!: number;
    private lineConfig = { lineWidth: 1, cursorOffset: 20 };
    private linesActivated = false;

    private estimateActualImageSize(
        annotatorWidth: number,
        annotatorHeight: number
    ): { actualImageHeight: number; actualImageWidth: number } {
        const annotatorLandscapeRatio = annotatorWidth / annotatorHeight;
        if (annotatorLandscapeRatio > this.$store.state.image.landscapeRatio) {
            // The limiting direction is vertical (height)
            return {
                actualImageHeight: annotatorHeight,
                actualImageWidth:
                    annotatorHeight * this.$store.state.image.landscapeRatio
            };
        } else {
            // The limiting direction is horizontal (width)
            return {
                actualImageHeight:
                    annotatorWidth / this.$store.state.image.landscapeRatio,
                actualImageWidth: annotatorWidth
            };
        }
    }
    public mounted(): void {
        window.addEventListener("resize", () => {
            const annotatorSurface = document.getElementById(
                "annotation-surface-image"
            ) as HTMLElement;
            const annotatorWidth = annotatorSurface.offsetWidth;
            const annotatorHeight = annotatorSurface.offsetHeight;
            const {
                actualImageWidth,
                actualImageHeight
            } = this.estimateActualImageSize(annotatorWidth, annotatorHeight);
            this.$store.commit("updateRatio", {
                actualImageWidth,
                actualImageHeight
            });
            const boxOffset: Point = {
                x: annotatorWidth / 2 - actualImageWidth / 2,
                y: annotatorHeight / 2 - actualImageHeight / 2
            };
            this.$store.commit("updateBoxOffset", boxOffset);
        });
    }

    private onMouseMove(event: MouseEvent): void {
        const elem = this.$el as HTMLElement;
        const offset = {
            left: elem.offsetLeft + this.$store.state.boxOffset.x,
            top: elem.offsetTop + this.$store.state.boxOffset.y
        };

        const cursor = {
            x: event.clientX,
            y: event.clientY
        };

        const relativeCursor = {
            x: (cursor.x - offset.left) * this.$store.state.image.ratio.width,
            y: (cursor.y - offset.top) * this.$store.state.image.ratio.height
        };

        this.cursorInformation.cursor = cursor;
        this.cursorInformation.offset = offset;
        this.cursorInformation.elem = elem;
        this.$store.commit("updateRelativeCursor", relativeCursor);

        if (this.drawing) {
            this.drawed.width = Math.abs(
                this.$store.state.relativeCursor.x - this.drawedMouseDown.x
            );
            this.drawed.height = Math.abs(
                this.$store.state.relativeCursor.y - this.drawedMouseDown.y
            );

            this.drawed.x =
                this.$store.state.relativeCursor.x - this.drawedMouseDown.x < 0
                    ? this.$store.state.relativeCursor.x
                    : this.drawedMouseDown.x;
            this.drawed.y =
                this.$store.state.relativeCursor.y - this.drawedMouseDown.y < 0
                    ? this.$store.state.relativeCursor.y
                    : this.drawedMouseDown.y;
        }
    }

    /** Deactivate surface when leaved. */
    private onMouseLeave(event: MouseEvent): void {
        if (this.$el === event.target) {
            this.drawing = false;
        }
    }

    private onMouseDown(event: MouseEvent): void {
        if (
            this.$el === event.target &&
            !this.drawing &&
            isNaN(this.$store.state.selectedAnnotationIndex)
        ) {
            event.preventDefault();
            this.drawed.width = 0;
            this.drawed.height = 0;

            this.drawedMouseDown.x = this.$store.state.relativeCursor.x;
            this.drawedMouseDown.y = this.$store.state.relativeCursor.y;

            this.drawed.x = this.$store.state.relativeCursor.x;
            this.drawed.y = this.$store.state.relativeCursor.y;
            this.drawing = true;
        }
    }

    private onMouseUp(): void {
        if (this.drawing) {
            this.drawing = false;
            const box = {
                width: Math.round(this.drawed.width),
                height: Math.round(this.drawed.height),
                x: this.drawed.x,
                y: this.drawed.y
            };
            const limitSize = this.$store.state.minTrashSize;
            if (box.width > limitSize && box.height > limitSize) {
                this.$store.commit("addBox", box);
            } else {
                console.log("Box is too small");
            }
            this.resetDrawed();
        } else {
            this.$store.commit("resetSelectedBox");
        }
    }
    private resetDrawed(): void {
        this.drawed.width = NaN;
        this.drawed.height = NaN;
        this.drawed.x = NaN;
        this.drawed.y = NaN;
    }
}
</script>
<style scoped>
#annotation-surface-image {
    position: relative;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain !important;
    /* border: solid 0.1px red; */
}
#loader-animation {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
}
</style>
