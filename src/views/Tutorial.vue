<template>
    <div id="tutorial">
        <div class="dots">
            <span class="dot" v-bind:class="{ blue: this.step >= 1 }"></span>
            <span class="dot" v-bind:class="{ blue: this.step >= 2 }"></span>
            <span class="dot" v-bind:class="{ blue: this.step >= 3 }"></span>
        </div>
        <transition name="fade">
            <Introduction
                v-if="this.step === 0"
                key="introduction"
                v-on:nextstep="handleNextStep"
            />
            <Classify
                v-else-if="this.step === 1"
                :step="step"
                key="classify"
                v-on:nextstep="handleNextStep"
                v-on:previousstep="handlePreviousStep"
            />
            <Draw
                v-else-if="this.step === 2"
                :step="step"
                key="draw"
                v-on:nextstep="handleNextStep"
                v-on:previousstep="handlePreviousStep"
            />
            <Annotate
                v-else-if="this.step === 3"
                :step="step"
                key="annotate"
                v-on:nextstep="handleNextStep"
                v-on:previousstep="handlePreviousStep"
            />
            <Congrats
                v-else-if="this.step === 4"
                key="congrats"
                v-on:nextstep="handleNextStep"
                v-on:previousstep="handlePreviousStep"
            />
        </transition>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Introduction from "../components/tutorial/Introduction.vue";
import Upload from "../components/tutorial/Upload.vue";
import Classify from "../components/tutorial/Classify.vue";
import Draw from "../components/tutorial/Draw.vue";
import Annotate from "../components/tutorial/Annotate.vue";
import Congrats from "../components/tutorial/Congrats.vue";

@Component({
    components: {
        Introduction,
        Upload,
        Classify,
        Draw,
        Annotate,
        Congrats
    }
})
export default class Tutorial extends Vue {
    private step = 0;

    private handleNextStep() {
        this.step += 1;
    }

    private handlePreviousStep() {
        this.step -= 1;
    }
}
</script>

<style scoped>
#tutorial {
    width: 100%;
    margin-left: auto;
    margin-bottom: 5rem;
}

.dots {
    margin-left: auto;
    width: 45%;
    margin-bottom: 1rem;
}

.dot {
    height: 0.5rem;
    width: 0.5rem;
    margin-right: 0.5rem;
    background-color: white;
    border-radius: 50%;
    display: inline-block;
}

.blue {
    background-color: #0073be;
}

.fade-enter-active {
    transition: opacity 0.5s;
}
.fade-enter {
    opacity: 0;
}
</style>
