<template>
    <div>
        <div class="illustration"></div>
        <div class="explanation">
            <h1>Classify pictures</h1>
            <p>
                Go to the “Classify” section to see uploaded pictures (all pictures are mixed. If you uploaded, you won’t only see yours). 
            </p>
            <p>For each picture:</p>
            <ol class="box">
                <li>Click in the right panel to indicate where the picture was taken (this enables the data to be used for research) 
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
                <li>Indicate the viewpoint. Is the picture taken from above or sideway?
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
                <li>Specify the quality of the picture. Choose bad if the picture is blurry or pixelized
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

    @Component({})
    export default class Classify extends Vue {
        private readonly state: AnnotationStore = getModule(AnnotationStore);

    }
</script>

<style scoped>
     .explanation {
        width:45%;
        margin-left: auto;
    }

   
    .illustration {
        width:50%;
        background-image: url("/images/tutorial/tuto-classify-scene.png"); 
        background-repeat: no-repeat;
        height: 100%;
        background-size:cover;
        background-position: center;
        position:fixed;
        top:0;
        left:0;
        display:flex;
        justify-content: center;
        align-items: center;
    }


    .illustration img {
        width:60%;
        margin-top:auto;
        margin-bottom:auto;
    }

    .box {
        margin: 2rem 0;
        padding:2rem 3rem;
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