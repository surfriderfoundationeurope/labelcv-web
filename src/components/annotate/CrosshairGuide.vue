<template>
    <div>
        <div id="horizontal-line-1" v-bind:style="stylehorline1"></div>
        <div id="horizontal-line-2" v-bind:style="stylehorline2"></div>
        <div id="vertical-line-1" v-bind:style="stylevertline1"></div>
        <div id="vertical-line-2" v-bind:style="stylevertline2"></div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
@Component({})
// Four lines that help position the crosshair accurately */
export default class CrosshairGuide extends Vue {
    data() {
        return {
            lineConfig: { lineWidth: 1, cursorOffset: 20 }
        };
    }
    @Prop() private cursorInformation!: Record<string, any>;

    get stylehorline1() {
        if (this.cursorInformation.elem != null) {
            const cursor = this.cursorInformation.cursor;
            const elem = this.cursorInformation.elem;
            const offset = this.cursorInformation.offset;

            const top =
                Math.min(
                    Math.max(
                        offset.top - elem.offsetTop,
                        cursor.y - elem.offsetTop
                    ),
                    this.$store.state.actualImageHeight +
                        this.$store.state.boxOffset.y
                ) + "px";
            const left = this.$store.state.boxOffset.x + "px";
            const width =
                Math.min(
                    this.$store.state.actualImageWidth,
                    Math.max(
                        0,
                        cursor.x -
                            offset.left -
                            this.$data.lineConfig.cursorOffset
                    )
                ) + "px";
            const height = this.$data.lineConfig.lineWidth + "px";
            return {
                position: "absolute",
                top: top,
                left: left,
                height: height,
                width: width,
                backgroundColor: "rgba( 245,30,20,0.7)"
            };
        }
        return {};
    }
    get stylehorline2() {
        if (this.cursorInformation.elem != null) {
            const cursor = this.cursorInformation.cursor;
            const elem = this.cursorInformation.elem;
            const offset = this.cursorInformation.offset;

            const top =
                Math.min(
                    Math.max(
                        cursor.y - elem.offsetTop,
                        offset.top - elem.offsetTop
                    ),
                    this.$store.state.actualImageHeight +
                        this.$store.state.boxOffset.y
                ) + "px";
            const left =
                Math.max(
                    offset.left - elem.offsetLeft,
                    cursor.x -
                        elem.offsetLeft +
                        this.$data.lineConfig.cursorOffset
                ) + "px";
            const width =
                Math.max(
                    0,
                    Math.min(
                        this.$store.state.actualImageWidth,
                        this.$store.state.actualImageWidth -
                            (cursor.x -
                                offset.left +
                                this.$data.lineConfig.cursorOffset)
                    )
                ) + "px";
            const height = this.$data.lineConfig.lineWidth + "px";
            return {
                position: "absolute",
                top: top,
                left: left,
                height: height,
                width: width,
                backgroundColor: "rgba( 245,30,20,0.7)"
            };
        }
        return {};
    }
    get stylevertline1() {
        if (this.cursorInformation.elem != null) {
            const cursor = this.cursorInformation.cursor;
            const elem = this.cursorInformation.elem;
            const offset = this.cursorInformation.offset;

            const top = this.$store.state.boxOffset.y + "px";
            const left =
                Math.max(
                    offset.left - elem.offsetLeft,
                    Math.min(
                        cursor.x - elem.offsetLeft,
                        this.$store.state.actualImageWidth +
                            offset.left -
                            elem.offsetLeft
                    )
                ) + "px";
            const width = this.$data.lineConfig.lineWidth + "px";
            const height =
                Math.min(
                    this.$store.state.actualImageHeight,
                    Math.max(
                        0,
                        cursor.y -
                            offset.top -
                            this.$data.lineConfig.cursorOffset
                    )
                ) + "px";
            return {
                position: "absolute",
                top: top,
                left: left,
                height: height,
                width: width,
                backgroundColor: "rgba( 245,30,20,0.7)"
            };
        }
        return {};
    }
    get stylevertline2() {
        if (this.cursorInformation.elem != null) {
            const cursor = this.cursorInformation.cursor;
            const elem = this.cursorInformation.elem;
            const offset = this.cursorInformation.offset;

            const top =
                cursor.y -
                elem.offsetTop +
                this.$data.lineConfig.cursorOffset +
                "px";
            const left =
                Math.max(
                    offset.left - elem.offsetLeft,
                    Math.min(
                        cursor.x - elem.offsetLeft,
                        this.$store.state.actualImageWidth +
                            offset.left -
                            elem.offsetLeft
                    )
                ) + "px";
            const width = this.$data.lineConfig.lineWidth + "px";
            const height =
                Math.max(
                    0,
                    this.$store.state.actualImageHeight -
                        (cursor.y -
                            offset.top +
                            this.$data.lineConfig.cursorOffset)
                ) + "px";
            return {
                position: "absolute",
                top: top,
                left: left,
                height: height,
                width: width,
                backgroundColor: "rgba( 245,30,20,0.7)"
            };
        }
        return {};
    }
}
</script>
<style scoped></style>
