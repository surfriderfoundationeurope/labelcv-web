<template>
    <div id="annotator" @mousemove="onMouseMove">
        <v-dialog/>
        <img class="image-loader" ref="imageLoader"/>
        <div
                id="annotator-surface-container"
                ref="surface"
                :style="{ width: `${surfaceWidth}%` }"
        >
            <AnnotationSurface/>
        </div>
        <div
                id="annotator-sizer"
                ref="sizer"
                @mousedown="onMouseDown()"
                @mouseup="onMouseUp()"
        ></div>
        <div id="annotator-control-panel">
            <div id="annotator-zoom-panel-container">
                <ZoomPanel/>
            </div>
            <div id="annotator-action-panel-container">
                <div id="annotation-action-panel">
                    <div id="annotation-class-selectors">
            <span>
              <strong> {{ currentAnnotationLabel }} </strong>
            </span>
                    </div>

                    <!--            <div v-else>-->
                    <!--                <h3> Select a label: </h3>-->
                    <!--&lt;!&ndash;            {{currentAnnotationClassInputId = selectedAnnotationClass}}&ndash;&gt;-->
                    <!--              <div v-for="annotationClass in state.annotationClasses" :key="annotationClass.id">-->
                    <!--                <input-->
                    <!--                        v-model="currentAnnotationClassInputId"-->
                    <!--                        type="radio"-->
                    <!--                        name="class"-->
                    <!--                        :value="annotationClass.id"/>-->
                    <!--                {{ annotationClass.label }}-->
                    <!--              </div>-->
                    <!--              </div>-->
                    <!--          </div>-->
                    <div class="annotation-group">
                        <p>Context</p>
                        <segmented-control
                                ref="env-control"
                                class="flex-segmented-control"
                                :options="state.contextEnvClasses"
                                label="label"
                                value="value"
                                color="#fff"
                                active-color="#0073be"
                                :multiple="true"
                                @select="onSelectEnv"
                        />
                    </div>

                    <div class="annotation-group">
                        <p>Environment</p>

                        <segmented-control
                                ref="env-control"
                                class="flex-segmented-control"
                                :options="state.contextEnvClasses"
                                label="label"
                                value="value"
                                color="#fff"
                                active-color="#0073be"
                                :multiple="true"
                                @select="onSelectEnv"
                        />
                    </div>
                    <div class="annotation-group">
                        <p>View Point</p>
                        <segmented-control
                                ref="pov-control"
                                class="flex-segmented-control"
                                :options="state.contextPovClasses"
                                label="label"
                                value="value"
                                color="#fff"
                                active-color="#0073be"
                                :multiple="false"
                                @select="onSelectPov"
                        >
                        </segmented-control>
                    </div>

                    <div class="annotation-group">
                        <p>Photo quality</p>
                        {{ state.pictureContext.quality }}

                        <segmented-control
                                ref="quality-control"
                                class="flex-segmented-control"
                                :options="state.contextQualityClasses"
                                label="label"
                                value="value"
                                color="#fff"
                                active-color="#0073be"
                                :multiple="false"
                                @select="onSelectQuality"
                        >
                        </segmented-control>
                    </div>
                </div>
            </div>
            <div id="annotation-action-buttons">
                <b-button variant="primary" @click="onValidateAnnotationsClick">
                    Validate {{ state.annotations.length }} annotations
                </b-button>
                <b-button variant="secondary" @click="onSkipPictureClick">
                    Skip
                </b-button>
                <!-- <b-button class="reset-annotations" @click="onResetAnnotationsClick">
                  Reset
                </b-button> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import {getModule} from 'vuex-module-decorators';
    import SegmentedControl from 'vue-segmented-control';
    // import { AnnotationClass } from "@/models/annotation";
    import AnnotationStore from '@/store/store.annotation';
    import {
        Edit2Icon,
        CheckIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
        Trash2Icon,
        AlertTriangleIcon,
    } from 'vue-feather-icons';

    import AnnotationSurface from '@/components/annotation/AnnotationSurface.vue';
    import ZoomPanel from '@/components/annotation/ZoomPanel.vue';
    // import SegmentedControl from '@/components/annotation/SegmentedControl.vue';

    // import store from "../store/store";
    import {BButton} from 'bootstrap-vue';

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
            SegmentedControl,
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
            this.state.fetchState();
        }

        private mounted(): void {
            this.state.registerImageLoader(this.$refs.imageLoader as HTMLImageElement);
        }

        get currentAnnotationLabel() {
            return !isNaN(this.state.selectedAnnotationClass)
                ? this.state.annotationClasses[this.state.selectedAnnotationClass].type
                : '';
        }

        get annotation() {
            return (index: number) =>
                !isNaN(index)
                    ? this.state.annotations[index]
                    : this.state.annotations[this.state.annotations.length];
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
                    {title: 'Cancel'},
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
                    {title: 'Cancel'},
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
                    {title: 'Cancel'},
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
            // this.$refs['env-control'].optionsSelected = [];
            // this.$refs['pov-control'].optionsSelected = [];
            // this.$refs['quality-control'].optionsSelected = [];
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

        private onSelectEnv(optionsSelected: string[]): void {
            this.state.addEnvPictureContext(optionsSelected);
        }

        private onSelectPov(optionsSelected: string[]): void {
            this.state.addPovPictureContext(optionsSelected[0]);
        }

        private onSelectQuality(optionsSelected: string[]): void {
            this.state.addQualityPictureContext(optionsSelected[0]);
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

    #validate-action-button {
        width: 100%;
        background: #33cf78;
    }

    .reset-annotations {
        color: grey;
        cursor: pointer;
        font-size: 0.6em;
        margin-left: 0.5em;
    }

    #skip-action-button {
        width: 80%;
        display: inline-flex;
        background: black;
        color: dimgray;
        border: 1px solid dimgray;
    }

    .flex-segmented-control >>> .segmented-item {
        background-color: rgb(50, 50, 50);
        color: white;
        height: 1.4em;
        border-radius: 1.5em;
        border: none !important;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 5px 3px;
        padding: 0.75em 1em;
        font-size: 0.7em;
        flex: none;
        cursor: pointer;
        font-weight: bold;
    }

    .flex-segmented-control >>> .segmented-item:hover {
        background-color: rgb(70, 70, 70);
    }

    .flex-segmented-control >>> .segmented-item.is-selected {
        background-color: rgb(0, 115, 190) !important;
    }

    .flex-segmented-control >>> .segmented-item.is-selected:hover {
        background-color: rgb(1, 75, 122) !important;
    }

    .flex-segmented-control.segmented-control {
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        border: 0 !important;
    }
</style>
