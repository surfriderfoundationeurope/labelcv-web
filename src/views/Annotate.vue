<template>
  <div id="annotator">
    <div id="annotator-surface-container">
      <AnnotationSurface />
    </div>
    <div id="annotator-control-panel">
      <div id="annotator-zoom-panel-container">
        <ZoomPanel />
      </div>
      <div id="annotator-action-panel-container">
        <button class="boundingbox-action-button boundingbox-selector-button">
          <chevron-left-icon />
        </button>
        <div id="annotation-action-panel">
          <div id="annotation-class-selectors">
            <div v-for="annotationClass in annotationClasses" :key="annotationClass.id">
              <input type="radio" name="class" :value="annotationClass.id" />
              {{ annotationClass.label }}
            </div>
          </div>
        </div>
        <button class="boundingbox-action-button boundingbox-selector-button">
          <chevron-right-icon />
        </button>
      </div>
      <div id="annotation-action-buttons">
        <button class="annotation-action-button annotation-action-button-reset">
          <trash-2-icon />
          <span>Reset annotation</span>
        </button>
        <button class="annotation-action-button annotation-action-button-validate">
          <check-icon />
          <span>Validate annotation</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Trash2Icon
} from "vue-feather-icons";

import AnnotationSurface from "@/components/AnnotationSurface.vue";
import ZoomPanel from "@/components/ZoomPanel.vue";

import { AnnotationClass } from "@/models/annotation";
import { annotationService } from "@/services/annotation";

@Component({
  components: {
    AnnotationSurface,
    ZoomPanel,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    Trash2Icon
  }
})
export default class Annotate extends Vue {
  /** */
  private annotationClasses: AnnotationClass[] = annotationService.getAnnotationClasses();

  private boxSelected: boolean = false;
}
</script>

<style scoped>
#annotator {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 100%;
}

#annotator-surface-container {
  width: 70%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#annotator-control-panel {
  display: flex;
  flex-direction: column;
  width: 27%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#annotator-zoom-panel-container {
  width: 100%;
  height: 50%;
  background: rgb(60, 60, 60);
  border: 1px solid rgb(25, 25, 25);
}

#annotator-action-panel-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 48%;
  margin-top: 5%;
  background-color: rgb(220, 220, 220);
  border: 1px solid rgb(25, 25, 25);
  color: rgb(60, 60, 60);
}

#annotation-action-panel {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
}

#annotation-action-buttons {
    width: 100%;
}

.boundingbox-action-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 100%;
  background: rgb(60, 60, 60);
  border: 0;
  color: white;
  cursor: pointer;
}

.annotation-action-button {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 5px;
  padding-left: 10px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.annotation-action-button span {
    padding-left: 10px;
}

.annotation-action-button:hover {
  background-position: left bottom;
}

.annotation-action-button-reset {
  background: linear-gradient(to right, rgb(152, 39, 39) 50%, rgb(181, 67, 67) 50%);
  background-size: 200% 100%;
  background-position: right bottom;
  transition: all .2s ease-out;
  border: 1px solid rgb(101, 24, 24);
}

.annotation-action-button-validate {
  background: linear-gradient(to right, rgb(37, 78, 37) 50%, rgb(53, 125, 53) 50%);
  background-size: 200% 100%;
  background-position: right bottom;
  transition: all .2s ease-out;
  border: 1px solid rgb(18, 81, 18);
}
</style>