<template>
    <div>
        <div class="illustration">
            <div>
                <div class="img-wrapper">
                    <img
                        src="/images/tutorial/tuto-wrong-1.jpg"
                        alt="Example of a wrong bounding box"
                    />
                </div>
                <div class="img-wrapper">
                    <img
                        src="/images/tutorial/tuto-right-1.jpg"
                        alt="Example of a right bounding box"
                    />
                </div>
            </div>
            <div>
                <div class="img-wrapper">
                    <img
                        src="/images/tutorial/tuto-wrong-2.jpg"
                        alt="Example of a wrong bounding box"
                    />
                </div>
                <div class="img-wrapper">
                    <img
                        src="/images/tutorial/tuto-right-2.jpg"
                        alt="Example of a right bounding box"
                    />
                </div>
            </div>
            <div>
                <div class="img-wrapper">
                    <img
                        src="/images/tutorial/tuto-wrong-3.jpg"
                        alt="Example of a wrong bounding box"
                    />
                </div>
                <div class="img-wrapper">
                    <img
                        src="/images/tutorial/tuto-right-3.jpg"
                        alt="Example of a right bounding box"
                    />
                </div>
            </div>
        </div>
        <div class="explanation">
            <p class="pre-title">Step {{ this.$props.step }}</p>
            <h1>Draw bounding boxes</h1>
            <p>
                And now, the most important part: we need you to draw bounding
                boxes on each litter item.
            </p>
            <p>
                It teaches the Artificial Intelligence what’s litter and what’s
                not! Use the magnifying glass in the top right corner to draw
                precisely.
            </p>
            <p>Here are few tips to draw bounding boxes</p>
            <ol class="box">
                <li>
                    Encompass as close as possible the litter item in the box
                </li>
                <li>Capture the full object</li>
                <li>
                    Exclude from the box the reflexion of the trash on water
                </li>
            </ol>
            <p>More tips</p>
            <ul class="box">
                <li>
                    When unsure whether it’s one or two objects: capture just
                    one
                </li>
                <li>
                    When several very small objects are nearby: capture them all
                    together
                </li>
                <li>When unsure if this is a trash: Do not label it</li>
                <li>
                    It's OK to label pictures featuring paddles or kayak parts;
                    however, paddles & kayak parts should not be labelled as
                    litter items.
                </li>
            </ul>
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
import Vue from "vue";
import Component from "vue-class-component";

@Component({
    props: ["step"]
})
export default class Draw extends Vue {}
</script>

<style scoped>
.explanation {
    width: 45%;
    margin-left: auto;
    padding-bottom: 5rem;
}

.illustration {
    width: 50%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.img-wrapper {
    position: relative;
    display: inline;
    height: auto;
    width: 100%;
}
.icon {
    position: absolute;
    height: 1.5rem;
    width: 1.5rem;
    background-color: yellow;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon p {
    margin: 0;
    font-weight: bold;
}

.wrong {
    background-color: #cf2b29;
}

.wrong p {
    font-size: 1.5rem;
    transform: rotate(45deg);
}

.right {
    background-color: #0073be;
}

.right p {
    font-size: 0.9rem;
}

.illustration img {
    width: 40%;
    margin-bottom: 5rem;
    margin-left: 2rem;
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
</style>
