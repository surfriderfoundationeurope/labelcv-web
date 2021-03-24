<template>
    <div id="annotator">
        <v-dialog />
        <img class="image-loader" ref="imageLoader" />
        <div
            id="annotator-surface-container"
            ref="surface"
            :style="{ width: `${surfaceWidth}%` }"
        >
            <AnnotationSurface />
        </div>
        <div id="annotator-control-panel">
            <div id="annotator-zoom-panel-container">
                <ZoomPanel />
            </div>
            <div class="flexColumnFullWidth">
                <b-button
                    variant="primary"
                    @click="onClickCheckClassification()"
                >
                    Check classification
                </b-button>
            </div>
            <ContextSelectionPanel ref="contextSelectionPanel" />
            <div id="annotate-action-buttons">
                <!-- TODO : disable the button if !state.contextSelections  -->
                <b-button
                    variant="primary"
                    :disabled="false"
                    @click="onClickValidateButton"
                    >Validate
                    {{ this.$store.getters.numberOfAnnotations }}
                    annotations</b-button
                >
                <b-button variant="secondary" @click="onClickSkipButton"
                    >Skip</b-button
                >
                <b-button class="reset-button" @click="onClickResetButton">
                    Reset
                </b-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import {
    Edit2Icon,
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    Trash2Icon,
    AlertTriangleIcon
} from "vue-feather-icons";

import AnnotationSurface from "@/components/annotate/AnnotationSurface.vue";
import ZoomPanel from "@/components/annotate/ZoomPanel.vue";
import ContextSelectionPanel from "@/components/annotate/ContextSelectionPanel.vue";

@Component({
    components: {
        AnnotationSurface,
        ZoomPanel,
        ContextSelectionPanel,
        CheckIcon,
        Edit2Icon,
        ChevronLeftIcon,
        ChevronRightIcon,
        Trash2Icon,
        AlertTriangleIcon
    }
})
export default class Annotate extends Vue {
    data() {
        return {
            annotations: []
        };
    }
    private surfaceWidth = 70;
    private mounted(): void {
        this.$store.commit(
            "registerImageLoader",
            this.$refs.imageLoader as HTMLImageElement
        );
    }

    get contextSelectionPanel() {
        return this.$refs.contextSelectionPanel as ContextSelectionPanel;
    }

    get annotation() {
        return (index: number) =>
            !isNaN(index)
                ? this.$store.state.annotations[index]
                : this.$store.state.annotations[
                      this.$store.state.annotations.length
                  ];
    }

    private onClickResetButton() {
        this.$modal.show("dialog", {
            title: "Reset confirmation",
            text: "Would you like to reset existing annotations ?",
            buttons: [
                {
                    title: "Reset",
                    default: true,
                    handler: () => {
                        this.resetAnnotationsAndContextSelections();
                        this.$modal.hide("dialog");
                    }
                },
                { title: "Cancel" }
            ]
        });
    }

    private onClickValidateButton() {
        this.$modal.show("dialog", {
            title: "Annotation(s) confirmation",
            text: "Would you like to validate annotation(s) ?",
            buttons: [
                {
                    title: "Validate",
                    default: true,
                    handler: () => {
                        this.$store.dispatch("postAnnotationsAndContext"); // TODO : action
                        this.nextPicture();
                        this.$modal.hide("dialog");
                    }
                },
                { title: "Cancel" }
            ]
        });
    }

    private onClickSkipButton() {
        this.$modal.show("dialog", {
            title: "Skip confirmation",
            text: "Would you like to skip this picture ?",
            buttons: [
                {
                    title: "Yes",
                    default: true,
                    handler: () => {
                        this.nextPicture();
                        this.$modal.hide("dialog");
                    }
                },
                { title: "Cancel" }
            ]
        });
    }

    private nextPicture() {
        this.resetAnnotationsAndContextSelections();
        this.$store.dispatch("fetchState");
    }
    private resetAnnotationsAndContextSelections() {
        this.$store.commit("resetAnnotations");
        this.$store.commit("resetSelectedBox");
        this.contextSelectionPanel.resetContextSelections();
    }
    onClickCheckClassification() {
        const overlay = document.getElementById(
            "overlay-classification-container"
        ) as HTMLElement;
        overlay.style.display = "block";
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

#annotator-surface-container {
    height: 100%;
    margin: 0;
    padding: 0;
}

#annotator-control-panel {
    display: flex;
    flex: 1;
    margin-left: 15px;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    width: 100%;
    max-width: 400px;
}

#annotator-zoom-panel-container {
    width: 100%;
    flex-basis: 40%;
    margin-bottom: 10px;
    background: rgb(60, 60, 60);
    border: 1px solid rgb(25, 25, 25);
}

.flexColumnFullWidth {
    display: flex;
    flex-direction: column;
    width: 100%;
}
#annotate-action-buttons {
    display: flex;
    flex-direction: column;
}

#annotate-action-buttons *:not(:last-child) {
    margin-bottom: 0.25em;
}

.reset-annotations {
    color: grey;
    cursor: pointer;
    font-size: 0.6em;
    margin-left: 0.5em;
}
</style>
