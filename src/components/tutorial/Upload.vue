<template>
  <div>
    <div class="illustration">
      <img
        src="/images/tutorial/tuto-import.png"
        alt="Local import, Dropbox or Google Drive"
      />
    </div>
    <div class="explanation">
      <p class="pre-title">Step {{ this.$props.step }}</p>
      <h1>Upload pictures featuring litter items</h1>
      <p>
        The algorithm needs to learn what litter is and what is not. Our aim is
        to train it with + 20,000 labelled images to make it the most effective
        possible.
      </p>
      <p>
        You can upload new pictures by clicking on the upload button on the left
        corner.
      </p>
      <p>Here are few tips to take a usable photo follow</p>
      <ol class="box">
        <li>
          You can have one or more litter items on your pictures, but all should
          be near the centre.
        </li>
        <li>Take your picture at about 3 meters from the litter item.</li>
        <li>
          It is generally better to take your pictures in landscape format.
        </li>
      </ol>

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

@Component({ props: ['step'] })
export default class Upload extends Vue {}
</script>

<style scoped>
.explanation {
  width: 45%;
  margin-left: auto;
  padding-bottom: 5rem;
}

.illustration {
  height: 90%;
  width: 50%;
  position: fixed;
  display: flex;
  justify-content: center;
}

.illustration img {
  width: 50%;
  margin: auto;
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
