<template>
  <div id="annotator">
      <AnnotationSurface/>
      <div id="annotator-control-panel">
          <ZoomPanel/>
      </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import AnnotationSurface from '@/components/AnnotationSurface.vue';
import ZoomPanel from '@/components/ZoomPanel.vue';

@Component({components:{AnnotationSurface, ZoomPanel}})
export default class Annotate extends Vue {

}
</script>

<style scoped>
#annotator {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 94%;
    height: 60%;
    padding: 3% 3%;
}

#annotator-control-panel {
    width: 30%;
    background: rgb(60, 60, 60);
    border: 1px solid rgb(25, 25, 25);
}
</style>