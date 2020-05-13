<template>
    <div
            id="annotator"
            @mousemove="onMouseMove">
        <v-dialog/>
        <img class="image-loader" ref="imageLoader"/>
        <div
                id="annotator-surface-container"
                ref="surface"
                :style="{ width: `${surfaceWidth}%`}">
            <AnnotationSurface/>

        </div>
        <div
                id="annotator-sizer"
                ref="sizer"
                @mousedown="onMouseDown()"
                @mouseup="onMouseUp()">
        </div>
        <div id="annotator-control-panel">
            <div id="annotator-zoom-panel-container">
                <ZoomPanel/>
            </div>
            <div id="annotator-action-panel-container">
                <!--        <button class="boundingbox-select-button" @click="onSelectPrevious">-->
                <!--          <chevron-left-icon />-->
                <!--        </button>-->
                <!--       <div id="annotation-message-panel" v-if="isNaN(state.selectedAnnotation) && state.message">-->
                <!--              <alert-triangle-icon />-->
                <!--              {{state.message}}-->
                <!--               <alert-triangle-icon />-->

                <!--        </div>-->
                <!--        <div v-if="!isNaN(state.selectedAnnotation)" id="annotation-action-panel">-->
                <div id="annotation-action-panel">

                    <div id="annotation-class-selectors">
                        <!--        <div v-if="!isNaN(state.selectedAnnotationClass)">-->
                        <!--            <h3> Selected label: </h3>-->


                        <span> <strong> {{currentAnnotationLabel}}  </strong> </span></div>

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
                    <h3>Environment</h3>

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

                    <h3>View Point</h3>
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
                    <h3>Picture quality</h3>
                    {{qualityValue}}

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
                    <h3>Annotations : {{state.annotations.length}}</h3>
                    <div class="action-button-container">
                        <!--                        {{ this.state.annotations}}-->
                        <!--            <button-->
                        <!--                    v-show="!isNaN(state.selectedAnnotationClass)"-->
                        <!--              class="action-button action-button-warning boundingbox-action-button"-->
                        <!--              @click="onEditAnnotationClick">-->
                        <!--                <edit-2-icon class="svg-icon" />-->
                        <!--              <span>Edit</span>-->
                        <!--            </button>-->

                        <!--            <button-->
                        <!--                    v-show="isNaN(state.selectedAnnotationClass)"-->
                        <!--              class="action-button action-button-success boundingbox-action-button"-->
                        <!--              @click="onSaveAnnotationClick">-->
                        <!--              <check-icon class="svg-icon" />-->
                        <!--              <span>Save</span>-->
                        <!--            </button>-->
                        <!--            <button-->
                        <!--              class="action-button action-button-danger boundingbox-action-button"-->
                        <!--              @click="onDeleteAnnotationClick">-->
                        <!--              <trash-2-icon class="svg-icon" />-->
                        <!--              <span>Delete</span>-->
                        <!--            </button>-->
                    </div>
                </div>
                <!--        <button class="boundingbox-select-button" @click="onSelectNext">-->
                <!--          <chevron-right-icon />-->
                <!--        </button>-->
            </div>
            <div id="annotation-action-buttons">
                <button
                        id="reset-action-button"
                        class="action-button"
                        @click="onResetAnnotationsClick">
                    Reset
                </button>
                <button
                        id="validate-action-button"
                        class="action-button"
                        @click="onValidateAnnotationsClick">
                    Validate
                </button>
                <button
                        id="skip-action-button"
                        class="action-button"
                        @click="onSkipPictureClick">
                    Skip
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import {getModule} from 'vuex-module-decorators';
    import SegmentedControl from 'vue-segmented-control';
    import {AnnotationClass} from '@/models/annotation';
    import AnnotationStore from '@/store/store.annotation';
    import {
        Edit2Icon,
        CheckIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
        Trash2Icon,
        AlertTriangleIcon,
    } from 'vue-feather-icons';

    import VModal from 'vue-js-modal';

    import AnnotationSurface from '@/components/annotation/AnnotationSurface.vue';
    import ZoomPanel from '@/components/annotation/ZoomPanel.vue';
    // import SegmentedControl from '@/components/annotation/SegmentedControl.vue';

    import store from '../store/store';

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
            SegmentedControl

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
            return !isNaN(this.state.selectedAnnotationClass) ? this.state.annotationClasses[this.state.selectedAnnotationClass].label : ''
        }

        get annotation() {
            return (index: number) => !isNaN(index) ? this.state.annotations[index] : this.state.annotations[this.state.annotations.length]
        }

        private onSaveAnnotationClick() {
            // Ensure value is selected
            if (this.currentAnnotationClassInputId != null) {
                // Retrieve input value.

                this.state.saveSelectedAnnotation(this.currentAnnotationClassInputId);
                this.state.resetSelectedAnnotation()
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
                ]
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
                ]
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
                ]
            });
        }

        private nextPicture() {
            this.state.resetAnnotations();
            this.state.resetPictureContext();
            this.resetContextsSelected();

            this.state.fetchState();
        };

        private resetContextsSelected() {
            this.$refs["env-control"].optionsSelected = [];
            this.$refs["pov-control"].optionsSelected = [];
            this.$refs["quality-control"].optionsSelected = [];
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

        private onSelectEnv(optionsSelected: Array<string>): void {
            console.log(optionsSelected)
            this.state.addEnvPictureContext(optionsSelected)
        }

        private onSelectPov(optionsSelected: Array<string>): void {
            this.state.addPovPictureContext(optionsSelected[0])

        }

        private onSelectQuality(optionsSelected: Array<string>): void {
            this.state.addQualityPictureContext(optionsSelected[0])
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
        background-color: black;
        border: 1px solid rgb(25, 25, 25);
        color: white;
    }


    #annotation-action-buttons {
        width: 100%;
        display: inline-flex;
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
        /*justify-content: flex-start;*/
        align-items: center;
        margin: 6px;
        color: white;
        cursor: pointer;
        background: linear-gradient(
                to right,
                #007dcd 50%,
                #0073be 50%
        );
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

    #reset-action-button {
        width: 100%;
        background: #FF6A6A;
    }

    #skip-action-button {
        width: 80%;
        display: inline-flex;
        background: black;
        color: dimgray;
        border: 1px solid dimgray;
    }

    .flex-segmented-control >>> .segmented-item {
        border: 1px solid rgb(0, 115, 190) !important;
        border-radius: 15px !important;
        /*display: flex !important;*/
        margin: 3px !important;
        padding: 5px !important;
        width: 80px !important;
        font-size: 10px !important;
        font-weight: 900;
        flex: none !important;
    }

    .flex-segmented-control.segmented-control {
        display: flex;
        flex-wrap: wrap;
        align-content: space-between;
        border: 0 !important;
    }

    h3 {
        margin: 5px;
    }
</style>