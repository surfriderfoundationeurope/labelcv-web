<template>
  <div id="annotator" @mousemove="onMouseMove">
    <v-dialog />
    <img class="image-loader" ref="imageLoader" />
    <div id="annotator-surface-container" ref="surface" :style="{ width: `${surfaceWidth}%` }">
      <AnnotationSurface />
    </div>
    <div id="annotator-sizer" ref="sizer" @mousedown="onMouseDown()" @mouseup="onMouseUp()"></div>
    <div id="annotator-control-panel">
      <div id="annotator-zoom-panel-container">
        <ZoomPanel />
      </div>
      <div id="annotator-action-panel-container">
        <div id="annotation-action-panel">
          <div id="annotation-class-selectors">
            <span>
              <strong>{{ currentAnnotationLabel }}</strong>
            </span>
          </div>
          <div class="annotation-group">
            <p>Context</p>
            <b-form-group>
              <b-form-radio-group
               v-model="state.contextEnvClasses.selected"
              :options="state.contextEnvClasses.options"
              name="env-buttons"
              buttons
              @change="onSelectEnv"
              button-variant="dark"
              size="sm"
            />
          </b-form-group>
          </div>

          <div class="annotation-group">
            <p>View Point</p>
            <b-form-group>
              <b-form-radio-group
                v-model="state.contextPovClasses.selected"
                :options="state.contextPovClasses.options"
                name="pov-buttons"
                @change="onSelectPov"
                buttons
                button-variant="dark"
                size="sm"
              />
            </b-form-group>
          </div>

          <div class="annotation-group">
            <p>Photo quality</p>
            <b-form-group>
              <b-form-radio-group
                v-model="state.contextQualityClasses.selected"
                :options="state.contextQualityClasses.options"
                buttons
                @change="onSelectQuality"
                name="quality-buttons"
                button-variant="dark"
                size="sm"
              />
            </b-form-group>
          </div>
        </div>
      </div>
      <div id="annotation-action-buttons">
        <b-button
          variant="primary"
          :disabled="!isComplete"
          @click="onValidateAnnotationsClick"
        >Validate {{ state.annotations.length }} annotations</b-button>
        <b-button variant="secondary" @click="onSkipPictureClick">Skip</b-button>
        <!-- <b-button class="reset-annotations" @click="onResetAnnotationsClick">
                  Reset
        </b-button>-->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators';
// import { AnnotationClass } from "@/models/annotation";
// eslint-disable-next-line import/no-unresolved
import AnnotationStore from '@/store/store.annotation';
import {
  Edit2Icon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Trash2Icon,
  AlertTriangleIcon,
} from 'vue-feather-icons';

// eslint-disable-next-line import/no-unresolved
import AnnotationSurface from '@/components/annotation/AnnotationSurface.vue';
// eslint-disable-next-line import/no-unresolved
import ZoomPanel from '@/components/annotation/ZoomPanel.vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BButton } from 'bootstrap-vue';
import axios from 'axios';

@Component({
  components: {
    AnnotationSurface,
    ZoomPanel,
    CheckIcon,
    Edit2Icon,
    ChevronLeftIcon,
    ChevronRightIcon,
    Trash2Icon,
    AlertTriangleIcon,
    BButton,
  },
})
export default class Annotate extends Vue {
  /** */
  private readonly state: AnnotationStore = getModule(AnnotationStore);

  /** */
  private surfaceWidth: number = 70;

  /** */
  private isResizing: boolean = false;

  /** */
  private currentAnnotationClassInputId: number | null = null;

  private created(): void {
    axios.get('config.prod.json').then((response: { data: { url: string; }; }) => {
      this.state.setURL(response.data.url);
    }).catch((prodError) => {
      // eslint-disable-next-line no-console
      console.log(prodError);
      axios.get('config.dev.json').then((response: { data: { url: string; }; }) => {
        this.state.setURL(response.data.url);
      }).catch((devError) => {
      // eslint-disable-next-line no-console
        console.log(devError);
      });
    });
    this.state.fetchState();
  }


  private mounted(): void {
    this.state.registerImageLoader(this.$refs.imageLoader as HTMLImageElement);
  }

  get currentAnnotationLabel() {
    return !isNaN(this.state.selectedAnnotationClass)
      ? this.state.annotationClasses[this.state.selectedAnnotationClass].name
      : '';
  }

  get annotation() {
    return (index: number) => (!isNaN(index)
      ? this.state.annotations[index]
      : this.state.annotations[this.state.annotations.length]);
  }

  get isComplete() {
    return this.state.pictureContext.environment
           && this.state.pictureContext.quality
           && this.state.pictureContext.pointOfView;
  }

  private onSaveAnnotationClick() {
    // Ensure value is selected
    if (this.currentAnnotationClassInputId != null) {
      // Retrieve input value.

      this.state.saveSelectedAnnotation(this.currentAnnotationClassInputId);
      this.state.resetSelectedAnnotation();
      // reset v-model for input
      //   this.selectedAnnotationClassInput = null ;
    }
  }

  private onResetAnnotationsClick() {
    this.$modal.show('dialog', {
      title: 'Reset confirmation',
      text: 'Would you like to reset existing annotations ?',
      buttons: [
        {
          title: 'Reset',
          default: true,
          handler: () => {
            this.state.resetAnnotations();
            this.$modal.hide('dialog');
          },
        },
        { title: 'Cancel' },
      ],
    });
  }

  private onValidateAnnotationsClick() {
    this.$modal.show('dialog', {
      title: 'Annotation(s) confirmation',
      text: 'Would you like to validate annotation(s) ?',

      buttons: [
        {
          title: 'Validate',
          default: true,
          handler: () => {
            this.state.postAnnotations();
            this.nextPicture();
            this.$modal.hide('dialog');
          },
        },
        { title: 'Cancel' },
      ],
    });
  }

  private onSkipPictureClick() {
    this.$modal.show('dialog', {
      title: 'Skip confirmation',
      text: 'Would you like to skip this picture ?',
      buttons: [
        {
          title: 'Yes',
          default: true,
          handler: () => {
            this.nextPicture();
            this.$modal.hide('dialog');
          },
        },
        { title: 'Cancel' },
      ],
    });
  }

  private nextPicture() {
    this.state.resetAnnotations();
    this.state.resetPictureContext();
    this.resetContextsSelected();

    this.state.fetchState();
  }

  private resetContextsSelected() {
    // todo !
    const {
      contextPovClasses,
      contextEnvClasses,
      contextQualityClasses,
    } = this.state;
    contextEnvClasses.selected = [];
    contextPovClasses.selected = '';
    contextQualityClasses.selected = '';
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

  private onSelectEnv(optionsSelected: string): void {
    this.state.addEnvPictureContext(optionsSelected);
  }

  private onSelectPov(optionsSelected: string): void {
    this.state.addPovPictureContext(optionsSelected);
  }

  private onSelectQuality(optionsSelected: string): void {
    this.state.addQualityPictureContext(optionsSelected);
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
  width: 15px;
  height: 100%;
  margin: 0;
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
  background-color: black;
  color: white;
}

#annotation-action-buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
}

#annotation-action-buttons *:not(:last-child) {
  margin-bottom: 0.25em;
}

#annotation-action-panel {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 94%;
}

.annotation-group {
  margin-bottom: 0.5em;
}

.annotation-group p {
  font-weight: bold;
  margin: 0;
}

.action-button-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.action-button:hover {
  background-position: left bottom;
}

.action-button span {
  padding-left: 10px;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 6px;
  color: white;
  cursor: pointer;
  background: linear-gradient(to right, #007dcd 50%, #0073be 50%);
  background-size: 200% 100%;
  background-position: right bottom;
  transition: all 0.2s ease-out;
  border: 0;
  height: 25px;
  font-weight: 500;
  font-size: 15px;
}

.reset-annotations {
  color: grey;
  cursor: pointer;
  font-size: 0.6em;
  margin-left: 0.5em;
}
</style>
