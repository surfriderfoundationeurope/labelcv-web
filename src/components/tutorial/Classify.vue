<template>
  <div>
    <div class="illustration"></div>
    <div class="explanation">
      <p class="pre-title">Step {{ this.$props.step }}</p>
      <h1>Classify pictures</h1>
      <p>
        In the <strong>Annotate</strong> screen, a first picture will appear. We
        need you to classify the picture. To do that, go to the bottom right
        panel.
      </p>
      <p>For each picture:</p>
      <ol class="box">
        <li>
          First, indicate where the picture was taken.
          <div class="annotation-group">
            <b-form-group>
              <b-form-radio-group
                :options="state.contextEnvClasses.options"
                name="env-buttons"
                buttons
                button-variant="dark"
                size="sm"
              />
            </b-form-group>
          </div>
        </li>
        <li>
          Then, precise the viewpoint. Is the picture taken from above or
          sideway?
          <div class="annotation-group">
            <b-form-group>
              <b-form-radio-group
                :options="state.contextPovClasses.options"
                name="pov-buttons"
                buttons
                button-variant="dark"
                size="sm"
              />
            </b-form-group>
          </div>
        </li>
        <li>
          Last, specify the quality of the picture. Choose bad if the picture is
          blurry or pixelized.
          <div class="annotation-group">
            <b-form-group>
              <b-form-radio-group
                :options="state.contextQualityClasses.options"
                buttons
                name="quality-buttons"
                button-variant="dark"
                size="sm"
              />
            </b-form-group>
          </div>
        </li>
      </ol>

      <b-button
        class="btn-next-step"
        variant="secondary"
        @click="$emit('previousstep')"
      >
        Back
      </b-button>

      <b-button
        class="btn-next-step"
        variant="primary"
        @click="$emit('nextstep')"
      >
        Next >
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators';
import AnnotationStore from '@/store/store.annotation';

@Component({
  props: ['step'],
})
export default class Classify extends Vue {
  private readonly state: AnnotationStore = getModule(AnnotationStore);
}
</script>

<style scoped>
.explanation {
  width: 45%;
  margin-left: auto;
  padding-bottom: 5rem;
}

.illustration {
  width: 50%;
  background-image: url("/images/tutorial/tuto-classify-scene.jpg");
  background-repeat: no-repeat;
  height: 100%;
  background-size: cover;
  background-position: right;
  position: fixed;
  top: 0;
  left: 0;
}

.illustration img {
  margin-top: auto;
  margin-bottom: auto;
}

.pre-title {
  font-weight: bold;
  margin-bottom: 0;
  color: #0073be;
}

.box {
  margin: 2rem 0;
  padding: 2rem 3rem;
  border: 1px solid white;
  border-radius: 0.3rem;
}

.box li {
  margin-top: 0.6rem;
}

.annotation-group {
  margin: 0.5em 0;
}

.annotation-group p {
  font-weight: bold;
  margin: 0;
}
</style>
