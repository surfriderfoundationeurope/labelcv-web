<template>
    <div id="context-selection-panel">
        <div class="context-group">
            <p class="context-group-title">Context</p>
            <b-form-group>
                <b-form-radio-group
                    v-model="environmentSelection"
                    :options="environmentOptions"
                    name="env-buttons"
                    buttons
                    button-variant="dark"
                    size="sm"
                    :disabled="!!containsNoTrash"
                />
            </b-form-group>
        </div>

        <div class="context-group">
            <p>View Point</p>
            <b-form-group>
                <b-form-radio-group
                    v-model="viewPointSelection"
                    :options="viewPointOptions"
                    name="pov-buttons"
                    buttons
                    button-variant="dark"
                    size="sm"
                    :disabled="!!containsNoTrash"
                />
            </b-form-group>
        </div>

        <div class="context-group">
            <p>Photo quality</p>
            <b-form-group>
                <b-form-radio-group
                    v-model="qualitySelection"
                    :options="qualityOptions"
                    buttons
                    name="quality-buttons"
                    button-variant="dark"
                    size="sm"
                    :disabled="!!containsNoTrash"
                />
            </b-form-group>
        </div>

        <div class="context-group">
            <b-form-group>
                <b-form-checkbox
                    id="containsNoTrash"
                    v-model="containsNoTrash"
                    name="containsNoTrash"
                    value="true"
                >
                    This image does not contain trash or is inappropriate
                </b-form-checkbox>
            </b-form-group>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import { environmentOptions, viewPointOptions, qualityOptions } from "@/models";
import { Watch } from "vue-property-decorator";
@Component({})
export default class ContextSelectionPanel extends Vue {
    data() {
        return {
            environmentSelection: null,
            viewPointSelection: null,
            qualitySelection: null,
            containsNoTrash: false,

            environmentOptions: environmentOptions,
            viewPointOptions: viewPointOptions,
            qualityOptions: qualityOptions
        };
    }

    @Watch("environmentSelection")
    @Watch("viewPointSelection")
    @Watch("qualitySelection")
    @Watch("containsNoTrash")
    private onSelectionChange() {
        this.$store.commit("setContextSelections", {
            quality: this.$data.qualitySelection,
            viewPoint: this.$data.viewPointSelection,
            environment: this.$data.environmentSelection,
            containsTrash: this.$data.containsNoTrash === false
        });
    }
    public resetContextSelections() {
        this.$data.environmentSelection = null;
        this.$data.qualitySelection = null;
        this.$data.viewPointSelection = null;
        this.$data.containsNoTrash = false;
        this.$store.commit("resetContextSelections");
    }
}
</script>
<style scoped>
.context-group-title p {
    margin-bottom: 0.2em;
    font-size: 1rem;
}

.context-group p {
    font-weight: bold;
    margin: 0;
}

#context-selection-panel {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 94%;
}
</style>
