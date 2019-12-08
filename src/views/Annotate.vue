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
        <div id="annotator-boundingbox-selectors">
          <div class="boundingbox-action-button boundingbox-selector-button">&lt;</div>
          <div class="boundingbox-action-button boundingbox-selector-button">&gt;</div>
        </div>
        <div id="annotation-class-selectors">
            <input type="radio" name="class" value="0"/> Bottle
            <input type="radio" name="class" value="1"/> Fragment
            <input type="radio" name="class" value="2"/> Other
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AnnotationSurface from "@/components/AnnotationSurface.vue";
import ZoomPanel from "@/components/ZoomPanel.vue";

@Component({ components: { AnnotationSurface, ZoomPanel } })
export default class Annotate extends Vue {}
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
}

#annotator-action-panel-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 50%;
}

#annotator-boundingbox-selectors {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 32px;
}

#annotation-class-selectors {
  height: 75%;
  border: 1px white solid;
}

.boundingbox-action-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgb(60, 60, 60);
  border: 1px solid rgb(25, 25, 25);
}

.boundingbox-selector-button {
  width: 32px;
  height: 32px;
}
</style>