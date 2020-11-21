<template>
    <div>
        <div class="illustration">
            <h1>Welcome</h1>
        </div>
        <div class="explanation">
            <p>
                We all dream about swimming in clear blue waters and walking bare-footed on a beautiful white sand beach. 
                But plastic is invading every corner of the earth, from remote alpine lakes to the deepest oceanic trench. 
            </p>
            <p>
                Thankfully, there are many things we can do. This website is one of them: you can help us mapping river plastic pollution.  
            </p>
            <p>Together we can make our dream come true. </p>
            <p>We all dream about swimming in clear blue waters and walking bare-footed on a beautiful white sand beach. </p>
            <ul class="box">
                <li>80% of ocean plastic comes from land-based sources.</li>
                <li>Rivers are the main pathways for plastic to reach the ocean.</li>
                <li>Rivers full of plastics can still be considered as being in good environmental status (that’s not a joke, check the EU Water Framework Directive).</li>
                <li>Such data will help to compare plastic pollution levels, localize inputs, and track improvements.</li>
            </ul>
            <p>Surfrider’s Plastic Origins project is a citizen science project that uses AI to map plastic pollution in European rivers. </p>
            <b-button
            variant="primary"
            @click="$emit('nextstep')"
            >
            Let's start >
            </b-button>
        </div>
    </div>
</template>

<script lang='ts'>
    import Vue from 'vue';
    import Component from 'vue-class-component';

    @Component({})
    export default class Introduction extends Vue {}
</script>

<style scoped>
    .explanation {
        width:45%;
        margin-left: auto;
    }

    .illustration {
        width:50%;
        background-image: url("/images/tutorial/tuto-beach.jpeg"); 
        background-repeat: no-repeat;
        background-size:cover;
        height: 100%;
        position:fixed;
        top:0;
        left:0;
        display:flex;
        justify-content: center;
        align-items: center;
    }

    .illustration h1 {
        font-weight: 900;
        font-size: 6rem;
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