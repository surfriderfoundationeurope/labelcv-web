<template>
    <div class="illustration">
        <h1>Congrats!</h1>
        <p><strong>That’s the end of the tutorial!</strong></p>
        <div class="buttons">
            <b-button
                class="btn-next-step"
                variant="secondary"
                @click="$emit('previousstep')"
            >
                Back to the tutorial
            </b-button>

            <b-button id="btn-go" variant="primary" @click="$router.push('/')">
                Start labelling !
            </b-button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default class Congrats extends Vue {}
</script>

<style scoped>
h1 {
    font-weight: 900;
    font-size: 6rem;
}
.illustration {
    width: 100%;
    background-image: url("/images/tutorial/tuto-congrats.jpeg");
    background-repeat: no-repeat;
    height: 100%;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.box {
    margin: 1rem 0 2rem 0;
    padding: 2rem 3rem;
    border: 1px solid white;
    border-radius: 0.3rem;
}

.box li {
    margin-top: 0.6rem;
}

.buttons {
    display: flex;
}
#btn-go {
    margin-left: 2rem;
}
</style>
