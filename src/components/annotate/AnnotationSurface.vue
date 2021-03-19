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
        <BoundingBox id="raw" ref="raw" :raw="drawed" v-if="drawing" />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Box, Point } from "@/models";
import BoundingBox from "./BoundingBox.vue";
import GridLoader from "vue-spinner/src/PulseLoader.vue";

@Component({
    components: {
        BoundingBox,
        GridLoader
    }
})
export default class AnnotationSurface extends Vue {
    /** Current relative position into the surface. */
    private readonly relativeCursor: Point = { x: 0, y: 0 };

    /** Boolean flag indicating if a drawed is active. */
    private drawing = false;

    /** Current drawed. */
    private readonly drawed: Box = { x: NaN, y: NaN, width: NaN, height: NaN };
    private crossHeightShift!: number;

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
            this.updateRatioFromImageLoader();
            const annotatorWidth = annotatorSurface.offsetWidth;
            const annotatorHeight = annotatorSurface.offsetHeight;
            const {
                actualImageWidth,
                actualImageHeight
            } = this.estimateActualImageSize(annotatorWidth, annotatorHeight);
            const boxOffset: Point = {
                x: annotatorWidth / 2 - actualImageWidth / 2,
                y: annotatorHeight / 2 - actualImageHeight / 2
            };
            this.$store.commit("updateBoxOffset", boxOffset);
            // TODO : understand this magic number : why 24
            // Whithout this shift, the bounding box gets shifted when mouse leaves
            this.crossHeightShift = 24 * this.$store.state.image.ratio.height;
        });
    }

    private updateRatioFromImageLoader(): void {
        const imageLoader = document.getElementsByClassName(
            "image-loader"
        )[0] as HTMLElement;
        // We have to briefly display the image loader to get dimensions on client screen
        // TODO : Do we actually have to ?
        imageLoader.style.display = "inline-block";
        this.$store.commit("updateRatio", imageLoader);
        imageLoader.style.display = "none";
    }

    /**
     * Mouse move event listener with position relative
     * to client coordinate system (effectively displayed background).
     */
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

        this.$store.commit("updateRelativeCursor", relativeCursor);
        if (this.drawing) {
            this.drawed.width = relativeCursor.x - this.drawed.x;
            this.drawed.height = relativeCursor.y - this.drawed.y;
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
            this.drawed.x = this.$store.state.relativeCursor.x;
            this.drawed.y = this.$store.state.relativeCursor.y;
            this.drawing = true;
        }
    }

    private onMouseUp(): void {
        if (this.drawing) {
            this.drawing = false;
            const box = {
                width: this.drawed.width,
                height: this.drawed.height,
                x: this.drawed.x,
                y: this.drawed.y - this.crossHeightShift
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

.image-loader {
    display: none;
}
</style>
