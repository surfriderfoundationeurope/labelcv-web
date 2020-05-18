<template>
  <div id="annotator" @mousemove="onMouseMove">
    <v-dialog />
    <img class="image-loader" ref="imageLoader" />
    <div
      id="annotator-surface-container"
      ref="surface"
      :style="{ width: `${surfaceWidth}%` }"
    >
      <AnnotationSurface />
    </div>
    <div
      id="annotator-sizer"
      ref="sizer"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
    ></div>
    <div id="annotator-control-panel">
      <div id="annotator-zoom-panel-container">
        <ZoomPanel />
      </div>
      <div id="annotator-action-panel-container">
        <button class="boundingbox-select-button" @click="onSelectPrevious">
          <chevron-left-icon />
        </button>
        <div
          id="annotation-action-panel"
          v-if="!isNaN(state.selectedAnnotation)"
        >
          <div id="annotation-class-selectors">
            <div
              v-for="annotationClass in state.annotationClasses"
              :key="annotationClass.id"
            >
              <input type="radio" name="class" :value="annotationClass.id" />
              {{ annotationClass.label }}
            </div>
          </div>
          <div class="action-button-container">
            <button
              class="action-button action-button-success boundingbox-action-button"
              @click="onSaveAnnotationClick"
            >
              <check-icon />
              <span>Save</span>
            </button>
            <button
              class="action-button action-button-danger boundingbox-action-button"
              @click="onDeleteAnnotationClick"
            >
              <trash-2-icon />
              <span>Delete</span>
            </button>
          </div>
        </div>
        <button class="boundingbox-select-button" @click="onSelectNext">
          <chevron-right-icon />
        </button>
      </div>
      <div id="annotation-action-buttons">
        <button
          class="action-button action-button-danger annotation-action-button"
          @click="onResetAnnotationsClick"
        >
          <trash-2-icon />
          <span>Reset annotation</span>
        </button>
        <button
          class="action-button action-button-success annotation-action-button"
          @click="onValidateAnnotationsClick"
        >
          <check-icon />
          <span>Validate annotation</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { getModule } from "vuex-module-decorators";

import { AnnotationClass } from "@/models/annotation";
import AnnotationStore from "@/store/store.annotation";

import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Trash2Icon,
} from "vue-feather-icons";

import VModal from "vue-js-modal";

import AnnotationSurface from "@/components/annotation/AnnotationSurface.vue";
import ZoomPanel from "@/components/annotation/ZoomPanel.vue";
import store from "../store/store";

@Component({
  components: {
    AnnotationSurface,
    ZoomPanel,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    Trash2Icon,
  },
})
export default class Annotate extends Vue {
  /** */
  private readonly state: AnnotationStore = getModule(AnnotationStore);

  /** */
  private surfaceWidth: number = 70;

  /** */
  private isResizing: boolean = false;

  private mounted(): void {
    this.state.registerImageLoader(this.$refs.imageLoader as HTMLImageElement);
    this.state.fetchState();
  }

  private onDeleteAnnotationClick() {
    this.state.deleteSelectedAnnotation();
  }

  private onSaveAnnotationClick() {
    // TODO: Ensure value is selected.
    // TODO: retrieve input value.
    this.state.saveSelectedAnnotation(0);
  }

  private onResetAnnotationsClick() {
    this.$modal.show("dialog", {
      title: "Reset confirmation",
      text: "Would you like to reset existing annotations ?",
      buttons: [
        {
          title: "Reset",
          default: true,
          handler: () => {
            this.state.resetAnnotations();
            this.$modal.hide("dialog");
          },
        },
        { title: "Cancel" },
      ],
    });
  }

  private onValidateAnnotationsClick() {
    this.$modal.show("dialog", {
      title: "Annotation(s) confirmation",
      text: "Would you like to validate annotation(s) ?",
      buttons: [
        {
          title: "Validate",
          default: true,
          handler: () => {
            this.state.postAnnotations();
            this.$modal.hide("dialog");
          },
        },
        { title: "Cancel" },
      ],
    });
  }

  private onMouseMove(event: MouseEvent): void {
    if (event.target === this.$refs.sizer && this.isResizing) {
      // Width threshold normalization.
      if (this.surfaceWidth <= 50) {
        this.surfaceWidth = 50;
      }
      if (this.surfaceWidth >= 80) {
        this.surfaceWidth = 80;
      }
    }
  }

  private onMouseDown(event: MouseEvent): void {
    if (event.target === this.$refs.sizer) {
      event.preventDefault();
      this.isResizing = true;
    }
  }

  private onMouseUp(event: MouseEvent): void {
    if (event.target === this.$refs.sizer) {
      this.isResizing = false;
    }
  }

  private onSelectPrevious(): void {
    this.state.selectPrevious();
  }

  private onSelectNext(): void {
    this.state.selectNext();
  }
}
</script>

<style scoped>
.image-loader {
  display: none;
}

#annotator {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

#annotator-sizer {
  width: 1px;
  height: 100%;
  margin: 0 10px 0 12px;
  border-left: 1px solid rgb(150, 150, 150);
  cursor: ew-resize;
}

#annotator-surface-container {
  width: 70%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#annotator-control-panel {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

#annotator-zoom-panel-container {
  width: 100%;
  flex-basis: 40%;
  margin-bottom: 10px;
  background: rgb(60, 60, 60);
  border: 1px solid rgb(25, 25, 25);
}

#annotator-action-panel-container {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  justify-content: space-between;
  width: 100%;
  padding: 0;
  background-color: rgb(80, 80, 80);
  border: 1px solid rgb(25, 25, 25);
  color: white;
}

#annotation-action-buttons {
  width: 100%;
}

#annotation-action-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 94%;
  margin: 3%;
}

.action-button-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.action-button {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 5px;
  padding-left: 10px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.action-button:hover {
  background-position: left bottom;
}

.action-button span {
  padding-left: 10px;
}

.action-button-danger {
  background: linear-gradient(
    to right,
    rgb(234, 64, 64) 50%,
    rgb(168, 38, 38) 50%
  );
  background-size: 200% 100%;
  background-position: right bottom;
  transition: all 0.2s ease-out;
  border: 1px solid rgb(101, 24, 24);
}

.action-button-success {
  background: linear-gradient(
    to right,
    rgb(63, 169, 63) 50%,
    rgb(46, 113, 46) 50%
  );
  background-size: 200% 100%;
  background-position: right bottom;
  transition: all 0.2s ease-out;
  background-size: 200% 100%;
  border: 1px solid rgb(26, 64, 26);
}

.boundingbox-select-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  margin: 0;
  background: rgb(60, 60, 60);
  border: 0;
  color: white;
  cursor: pointer;
}

.boundingbox-action-button {
  width: 45%;
}

.annotation-action-button {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 1;
}
</style>
