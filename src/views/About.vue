<template>
    <div id="about">
        <h1>We are Surfrider Foundation Europe.</h1>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { getModule } from 'vuex-module-decorators';

@Component({
  components: {}
})
export default class About extends Vue {}
</script>

<style scoped>
#about {
  display: flex;
  justify-content: center;
  margin-top: 10rem;
}
h1 {
  font-weight:bold;
}
</style>