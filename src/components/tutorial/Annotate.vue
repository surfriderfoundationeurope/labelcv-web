<template>
    <div>
        <div class="illustration">
            <img src="/images/tutorial/tuto-bottle.jpg" alt="Example of a picture showing a bottle waste">
            <img src="/images/tutorial/tuto-fragment.png" alt="Example of a picture showing a bottle waste">
            <img src="/images/tutorial/tuto-other.png" alt="Example of a picture showing a bottle waste">
        </div>
        <div class="explanation">
            <h1>Annotate every bounding boxes</h1>
            
            <h4>Bottles</h4>
            <ul class="box">
                <p>This tag relates to drink related items: </p>
                <li>drink packaging (plastic bottles, glass bottles, metal cans, bricks)</li>
                <li>cleaning and chemical products stored in plastic bottles, glass bottles or metal cans</li>
                <li>drums < 5 Liters
                <p>
                    Characteristics: any color, any shape, any size (< 5 Litersl) also count cleaning and chemical products
                </p>
                </li>
                <p><strong>Labeling tips</strong> Do not label small fragments of bottles, label each bottle separately even if they are nearby</p>
                <p>⚠️ This tag do NOT include corks, cups, small flasks (< 500 ml)</p>
            </ul>
            <h4>Fragments</h4>
            <ul class="box">
                <p>This tag relates to thin plastic fragments from:</p>
                <li>shoes</li>
                <li>tires</li>
                <li>packaging</li>
                <li>balloons</li>
                <li>pipes</li>
                <li>inflatable unicorn</li>
                <li>...</li>
            </ul>
            <h4>Others</h4>
            <ul class="box">
                <p>This tag relates to all other litter items:</p>
                <li>plastic bags</li>
                <li>tarps</li>
                <li>clothes or textile</li>
                <p>Characteristics: any color, often found in trees, various shapes</p>
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
    export default class Annotate extends Vue {}
</script>

<style scoped>
    h4{
        margin-top:2rem;
    }
    .explanation {
        width:45%;
        margin-left: auto;
    }

   
    .illustration {
        width:50%;
        height: 100%;
        position:absolute;
        display:flex;
        flex-direction: column;
        align-items:center
    }
    .illustration img {
        width:80%;
        margin-bottom:5rem;
    }

    .box {
        margin: 1rem 0 2rem 0;
        padding:2rem 3rem;
        border: 1px solid white;
        border-radius: 0.3rem;
    }

    .box li {
        margin-top: 0.6rem;
    }
</style>