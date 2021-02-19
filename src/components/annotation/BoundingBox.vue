<template>
  <div
    :id="`bounding-box-${id}`"
    :class="{
      'bounding-box': true,
      'bounding-box-labelled': labelled,
      'bounding-box-disabled': disabled,
      'bounding-box-selected': selected,
    }"
    :style="{
      left: `${x - 2}px`,
      top: `${y - 5}px`,
      width: `${width + 4}px`,
      height: `${height + 9}px`,
    }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @click="onMouseClick"
  >
    <div>
      <div class="close-cross-container" v-show="!isBeingDrawn">
        <x-icon class="close-cross" @click="onClose" v-show="selected" />
      </div>
      <div
        class="bounding-box-content"
        :style="{
          width: `${width}px`,
          height: `${height}px`,
        }"
      >
        <div v-show="this.$props.id !== 'raw'" class="bounding-box-index">
          <p>{{ this.$props.id }}</p>
        </div>
        <pre v-if="annotationClassSelection">{{
          annotationClassSelection.name
        }}</pre>
      </div>

      <div class="box-multiselect" v-show="selected">
        <template>
          <div>
            <multiselect
              class="custom-multi"
              v-model="annotationClassSelection"
              :options="state.annotationClasses"
              label="name"
              placeholder="Select one"
              @input="onSelectAnnotation"
              onchange="editAnnotation"
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
import { XIcon } from 'vue-feather-icons';

import Vue, { VNode } from 'vue';
import Component from 'vue-class-component';
import Multiselect from 'vue-multiselect';

import { getModule } from 'vuex-module-decorators';

import AnnotationStore from '@/store/store.annotation';

import Box from '@/models/geometry/box';
import Size from '@/models/geometry/size';
import { Annotation, AnnotationClass } from '@/models/annotation';

// register globally
// Vue.component('multiselect', Multiselect);

@Component({
  components: {
    XIcon,
    Multiselect
  },
  props: ['id', 'raw', 'annotation']
})
export default class BoundingBox extends Vue {
  /** */
  private readonly state: AnnotationStore = getModule(AnnotationStore);

  /** */
  private annotationClassSelection = { id: NaN, name: null };
  private hovered: boolean = false;

  get box(): Box {
    const id = this.$props.id;
    if (id === 'raw') {
      return this.$props.raw;
    }
    // TODO: boundaries control.
    return this.state.annotations[id].box;
  }

  get isBeingDrawn(): boolean {
    return this.$props.id === 'raw';
  }

  get labelled(): boolean {
    return this.state.annotations[this.$props.id] !== undefined;
  }

  get annotationClassId(): number {
    if (this.annotationClassSelection !== undefined) {
      return this.annotationClassSelection.id;
    } else {
      return NaN;
    }
  }

  public get disabled(): boolean {
    return !this.sizeOK();
  }

  get selected(): boolean {
    return this.state.selectedAnnotation === this.$props.id;
  }

  get x(): number {
    return Math.round(this.state.imageReverseRatio.width * this.box.x + this.state.boxOffset.x);
  }

  get y(): number {
    return Math.round(this.state.imageReverseRatio.height * this.box.y + this.state.boxOffset.y);
  }

  get width(): number {
    return Math.round(this.state.imageReverseRatio.width * this.box.width);
  }

  get height(): number {
    return Math.round(this.state.imageReverseRatio.height * this.box.height);
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
    if (this.hovered) {
      this.state.select(this.$props.id);
    }
  }

  private onSelectAnnotation(): void {
    this.state.editAnnotationClass({
      annotationIndex: this.$props.id,
      annotationClassId: this.annotationClassSelection.id,
    });
  }
  private onClose(): void {
    this.state.deleteAnnotation(this.$props.id);
  }

  private sizeOK(): boolean {
    const limitSize = this.state.minTrashSize;
    return this.box.width >= limitSize && this.box.height >= limitSize;
  }
}
</script>

<style scoped>
.bounding-box {
  position: absolute;
  cursor: pointer;
  display: inline-block;
}

.bounding-box-content {
  border: 2px solid #33cf78;
}

.bounding-box-labelled .bounding-box-content {
  /*border: 2px solid darkgreen;*/
  border-style: dotted;
  border-color: white;
}

.bounding-box-index {
  border-radius: 50%;
  width: 10px;
  height: 10px;
  padding: 8px;
  background: #fff;
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
  /*border: 2px solid greenyellow;*/
  border-style: dotted;
}

.box-multiselect {
  display: inline-block;
  justify-content: space-between;
  width: 200px;
}

.close-cross-container {
  height: 24px;
}

.close-cross {
  align-self: flex-end;
  float: right;
  color: white;
  background: #ff6a6a;
  margin: 0.5px;
  border: 0.5px solid whitesmoke;
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
