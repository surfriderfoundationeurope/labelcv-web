<template>
    <div>
        <div class="illustration"></div>
        <div class="explanation">
            <h1>Draw bounding boxes</h1>
            <p>And now, the most important part: we need you to draw bounding boxes on each litter item.</p>
            <p>
                It teaches the Artificial Intelligence what’s litter and what’s not! 
                Use the magnifying glass in the top right corner to draw precisely. 
            </p>    
            <p>Here are few tips to draw bounding boxes</p>
            <ol class="box">
                <li>Encompass as close as possible the litter item in the box</li>
                <li>Capture the full object</li>
                <li>Exclude from the box the reflexion of the trash on water</li>
            </ol>
            <p>More tips</p>
            <ul class="box">
                <li>When unsure whether it’s one or two objects: Capture just one</li>
                <li>When several very small objects are nearby: Capture them all together</li>
                <li>When unsure if this is a trash: Do not label it</li>
                <li>It's OK to label pictures featuring paddles or kayak parts; however, paddles & kayak parts should not be labelled as litter items.</li>
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
    import Vue from 'vue';
    import Component from 'vue-class-component';

    @Component({})
    export default class Draw extends Vue {}
</script>

<style scoped>
 .explanation {
        width:45%;
        margin-left: auto;
    }

   
    .illustration {
        width:50%;
        background-image: url("/images/tutorial/placeholder-bottle.png"); 
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
</style>