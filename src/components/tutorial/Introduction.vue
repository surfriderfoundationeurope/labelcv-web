<template>
    <div>
        <div class="illustration"></div>
        <div class="explanation">
            <h1>Introduction</h1>
            <p>
                We all dream about swimming in clear blue waters and walking
                bare-footed on a beautiful white sand beach. But our dream is
                threatened. Plastics are invading every corner of the earth,
                from remote alpine lakes to the deepest oceanic trench.
            </p>
            <p>
                Thankfully, there are many things we can do.
            </p>
            <p>
                <a
                    href="www.plasticorigins.eu"
                    title="Link to PlasticOrigins website in a new tab"
                    target="_blank"
                >
                    Plastic Origins
                </a>
                , a citizen science project from
                <a
                    href="www.surfrider.eu"
                    title="Link to the SurfriderFoundation website in a new tab"
                    target="_blank"
                    >Surfrider Europe</a
                >, using artificial intelligence to map river plastic pollution,
                is one of them.
            </p>
            <p>
                On this platform, you can help us train our artificial
                intelligence model to detect and count litter items. We are
                altogether building the biggest opensource dataset of labelled
                images featuring litter items.
            </p>
            <p>
                Food for thought:
            </p>
            <ul class="box">
                <li>80% of ocean plastics come from land-based sources.</li>
                <li>
                    Rivers are the main pathway for plastics to reach the ocean.
                </li>
                <li>
                    Rivers full of plastics can still be considered as being in
                    good environmental status in Europe (micro- and
                    macroplastics pollution are not considered as indicators of
                    good environmental status in the EU Water Framework
                    Directive).
                </li>
                <li>
                    Read more on
                    <a
                        href="https://oceancampus.eu/"
                        title="Link to the Oceancampus website in a new tab"
                        target="_blank"
                    >
                        oceancampus.eu
                    </a>
                </li>
            </ul>
            <b-button variant="primary" @click="$emit('nextstep')">
                Let's start >
            </b-button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class Introduction extends Vue {}
</script>

<style scoped>
button {
    margin-bottom: 10rem;
}

.explanation {
    width: 45%;
    margin-left: auto;
    padding-bottom: 5rem;
}

.illustration {
    width: 50%;
    background-image: url("/images/tutorial/tuto-beach.jpg");
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.illustration h1 {
    font-weight: 900;
    font-size: 6rem;
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
