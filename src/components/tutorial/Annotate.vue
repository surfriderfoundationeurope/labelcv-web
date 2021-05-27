<template>
    <div>
        <div class="illustration">
            <img
                src="/images/tutorial/tuto-bottle.jpg"
                alt="Example of a picture showing a bottle waste"
            />
            <img
                src="/images/tutorial/tuto-fragment.png"
                alt="Example of a picture showing a bottle waste"
            />
            <img
                src="/images/tutorial/tuto-other.png"
                alt="Example of a picture showing a bottle waste"
            />
        </div>
        <div class="explanation">
            <p class="pre-title">Step {{ this.$props.step }}</p>

            <h1>Label bounding boxes</h1>

            <h4>Known categories</h4>
            <p>Group containing a few categories which are frequently observed. Together they make a big part of what is usually found on our sites.</p>
            <ul class="box">
                <p><strong>Rigid, in one piece:</strong> subgroup containing all objects which somehow have a definite shape and hold in place. They wouldn’t change shape so much if put somewhere else (as opposed to, for example, a plastic bag).</p>
                <li>
                    Insulating material: blocks of material (sometimes floating in water), used for insulation e.g. foam and polystyrene 
                </li>
                <li>
                    Tire: self-explanatory e.g. truck tire, car tire, bike tire.
                </li>
                <p>
                </p>
                <p><U>Liquid containers:</U> objects having a hollow shape for liquid containing, of various size and type.</p>
                <li>
                    Bottle-shaped: liquid container with the typical shape of a bottle. Usually a drinking bottle, but not always e.g. coke bottle, bier bottle, detergent bottle, reusable water-bottle for sports.
                </li>
                <li>   
                    Can-shaped: similarly, as for bottle-shaped but with cans. Could be crushed or smashed e.g. coke can, beer can.
                </li>
                <li>
                    Drum: larger containers (generally of several dozens of liters), usually used in industry (but could also be a household product) e.g. oil container, barrel of beer, waterproof drum for a specific product, etc
                </li>
                <li>
                    Other packaging: all other types of packaging that may not enter the previous categories e.g. milk pack, fast food box, yogurt pot, plastic cup, plastic plate, cleaning product container, etc
                </li>
                <p>
                </p>
                <p><strong>Soft, possibly in fragments:</strong> Group containing all objects which are soft and possibly broken in several pieces across the scene. As opposed to ‘rigid’ objects, they usually do not have a definite shape are just hanging on the background and/or falling under gravity.</p>
                <li>Sheet / Tarps / Plastic bags / Fragments of soft plastic: trash in the form of a layer that is either spread all over the place or broken into pieces. Could be of any surface (sometimes very large sometimes just a fragment) and of different origin e.g. black sheets from fields for agriculture, empty garbage bag, plastic bag from supermarkets, chips/crackers wrapping or individual wrapping for biscuits</li>
                <li>Fishing net / cords: filament-looking object from the fishing industry usually. Could also be something else as long as it has a similar aspect e.g. fishing net, fragments of a jumping rope</li>

            </ul>
            <h4>Other</h4>
            <p>Group containing less frequently observed objects for which we do not define a proper class</p>
            <ul class="box">
                <li>Easily nameable: anything that you recognize and would be able to describe. You know it has a name even though it was not proposed in our classes and would not be dubbed “packaging” e.g. tennis ball, water pipe, lighter</li>
                <li>Unclear: something that really you don’t recognize or have a hard time identifying</li> 

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

@Component({ props: ["step"] })
export default class Annotate extends Vue {}
</script>

<style scoped>
h4 {
    margin-top: 2rem;
}
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
.illustration img {
    width: 80%;
    margin-bottom: 5rem;
}

.pre-title {
    font-weight: bold;
    margin-bottom: 0;
    color: #0073be;
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
</style>
