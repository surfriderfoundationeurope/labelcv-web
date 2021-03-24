<template>
    <div
        :id="`bounding-box-${id}`"
        :class="{
            'bounding-box': true,
            'bounding-box-labelled': labelled,
            'bounding-box-disabled': disabled,
            'bounding-box-selected': selected
        }"
        :style="{
            left: `${x - 2}px`, // # TODO : understand those magic numbers 2 and 5 ? (again in ZoomPanel)
            top: `${y - 5}px`,
            width: `${width}px`,
            height: `${height}px`
        }"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @click="onMouseClick"
    >
        <div>
            <div
                :class="{
                    'close-cross-container': true,
                    'bounding-box-labelled': labelled
                }"
                v-show="!isBeingDrawn"
            >
                <x-icon
                    className="bounding-box-cross"
                    height="16px"
                    width="16px"
                    @click="onClickCross"
                    v-show="selected"
                />
            </div>
            <div
                class="bounding-box-content"
                :style="{
                    width: `${width}px`,
                    height: `${height}px`
                }"
            >
                <div
                    v-show="this.$props.id !== 'raw'"
                    class="bounding-box-index"
                >
                    <p>{{ index }}</p>
                </div>
                <div class="bounding-box-label" v-if="annotationLabel">
                    {{ annotationLabel.name }}
                </div>
            </div>

            <div class="box-multiselect" v-show="selected">
                <template>
                    <div>
                        <multiselect
                            class="custom-multi"
                            v-model="annotationLabel"
                            :options="$store.state.annotationLabels"
                            label="name"
                            placeholder="Select one"
                            @input="onSelectLabel"
                            @close="selected = false"
                            :show-labels="false"
                            :allow-empty="false"
                            :searchable="false"
                        ></multiselect>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<script lang="ts">
import { XIcon } from "vue-feather-icons";
import Vue from "vue";
import Component from "vue-class-component";
import Multiselect from "vue-multiselect";
import { Annotation, Box } from "@/models";

@Component({
    components: {
        XIcon,
        Multiselect
    },
    props: ["id", "raw"]
})
export default class BoundingBox extends Vue {
    data() {
        return {
            annotationLabel: null,
            hovered: false,
            selected: false
        };
    }

    get box(): Box {
        const id = this.$props.id;
        if (id === "raw") {
            return this.$props.raw;
        }
        return this.$store.getters.getAnnotationByUid(id).box;
    }

    get isBeingDrawn(): boolean {
        return this.$props.id === "raw";
    }

    get labelled(): boolean {
        return this.annotation ? !!this.annotation.annotationLabel : false;
    }
    get annotation(): Annotation {
        return this.$store.getters.getAnnotationByUid(this.$props.id);
    }
    get index(): number {
        return this.$store.getters.getIndexByUid(this.$props.id);
    }

    public get disabled(): boolean {
        return !this.sizeOK();
    }

    get x(): number {
        return Math.round(
            this.$store.state.image.reverseRatio.width * this.box.x +
                this.$store.state.boxOffset.x
        );
    }

    get y(): number {
        return Math.round(
            this.$store.state.image.reverseRatio.height * this.box.y +
                this.$store.state.boxOffset.y
        );
    }

    get width(): number {
        return Math.round(
            this.$store.state.image.reverseRatio.width * this.box.width
        );
    }

    get height(): number {
        return Math.round(
            this.$store.state.image.reverseRatio.height * this.box.height
        );
    }

    private onMouseEnter(event: MouseEvent): void {
        if (this.$el === event.target) {
            this.$data.hovered = true;
        }
    }

    private onMouseLeave(event: MouseEvent): void {
        if (this.$el === event.target) {
            this.$data.hovered = false;
        }
    }

    private onMouseClick(): void {
        if (this.$data.hovered) {
            this.$store.commit("selectAnnotation", this.$props.id);
            this.$data.selected = true;
        } else {
            this.$data.selected = false;
        }
    }

    private onSelectLabel(): void {
        this.$store.commit("updateBoxAnnotationLabel", {
            boxUid: this.$props.id,
            annotationLabel: this.$data.annotationLabel
        });
    }
    private onClickCross(): void {
        this.$store.commit("deleteBox", this.$props.id);
    }

    private sizeOK(): boolean {
        const limitSize = this.$store.state.minTrashSize;
        return this.box.width >= limitSize && this.box.height >= limitSize;
    }
}
</script>
<style scoped>
.custom-multi .multiselect__content-wrapper {
    overflow-y: scroll;
    width: unset;
}
.bounding-box {
    position: absolute;
    cursor: pointer;
    display: inline-block;
}
.close-cross-container {
    position: absolute;
    right: 0;
    background: rgba(51, 207, 120, 0.7);
    line-height: 1;
}
.bounding-box-cross {
    position: absolute;
}
.bounding-box-content {
    border: 2px solid rgb(51, 207, 120);
    display: flex;
    align-items: flex-end;
}

.bounding-box-labelled .bounding-box-content {
    border-style: dotted;
    border-color: #fff;
}
.bounding-box-labelled .bounding-box-index {
    background-color: #fff;
}
.bounding-box-label {
    background-color: rgba(255, 255, 255, 0.6);
    color: black;
    width: 100%;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.bounding-box-index {
    border-radius: 50%;
    width: 10px;
    height: 10px;
    padding: 8px;
    background: #33cf78;
    color: black;
    top: -5px;
    left: -5px;
    font-size: 10px;
    font-weight: bold;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
}

.bounding-box-index p {
    margin: 0px;
}

.bounding-box-disabled .bounding-box-content {
    border-color: #ff6a6a;
}

.bounding-box-selected .bounding-box-content {
    border-style: dotted;
}

.box-multiselect {
    display: inline-block;
    justify-content: space-between;
    width: 200px;
}

.custom-multi >>> .multiselect__tag-icon:focus {
    background: #0073be;
}

.custom-multi >>> .multiselect__tag-icon:hover {
    background: #0073be;
}

.custom-multi >>> .custom-multi.multiselect__tag {
    position: relative;
    display: inline-block;
    padding: 4px 26px 4px 10px;
    border-radius: 5px;
    margin-right: 10px;
    color: #fff;
    line-height: 1;
    background: #0073be;
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
}

.custom-multi >>> .custom-multi.multiselect__tag-icon:after {
    content: "×";
    color: #0073be;
    font-size: 14px;
}

.custom-multi >>> .multiselect__tag-icon:focus {
    background: #0073be;
}

.custom-multi >>> .multiselect__tag-icon:hover {
    background: #0073be;
}

.custom-multi >>> .multiselect__option--highlight {
    background: #0073be;
    outline: none;
    color: white;
}

.custom-multi >>> .multiselect__option--highlight:after {
    content: attr(data-select);
    background: #0073be;
    color: white;
}

.custom-multi
    >>> .multiselect__option--selected.multiselect__option--highlight {
    background: #0073be;
    color: #fff;
}

.custom-multi
    >>> .multiselect__option--selected.multiselect__option--highlight:after {
    background: #0073be;
    content: attr(data-deselect);
    color: #fff;
}
</style>
