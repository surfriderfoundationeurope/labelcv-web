<template>
  <div id="upload">
    <div id="upload-provider">
      <ul class="upload-provider-list">
        <li
            class="upload-provider-item"
            v-for="provider in providers"
            v-bind:key="provider"
            @click="onClick(provider)">
          <img class="upload-provider-item-icon" :src="`/images/providers/${provider.toLowerCase()}.png`" />
          <div class="upload-provider-item-label">{{ provider }}</div>
        </li>
      </ul>
    </div>
    <div id="upload-container">
        
    </div>
    <div class="preview">
        <img id="preview-container" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import { imageProviderService } from '../services/provider.service';

@Component({})
export default class Upload extends Vue {

  private providers: string[];

  constructor() {
    super();
    this.providers = imageProviderService.getAvailableImageProvider();
  }

  private async onClick(provider: string) {
      const imageProvider = imageProviderService.getImageProvider(provider);
      if (imageProvider) {
        const descriptors = await imageProvider.getImages('#upload-container');
      }
  }

}
</script>

<style scoped>
.upload-provider-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.upload-provider-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100%;
  margin: 30px;
  padding: 10px;
  background: rgb(70, 70, 70);
  border: 1px solid rgb(50, 50, 50);
  border-radius: 20px;
}

.upload-provider-item:hover {
  cursor: pointer;
  background: rgb(50, 50, 50);
}

.upload-provider-item-icon {
  width: 64px;
  height: 64px;
  margin: 10px;
}

.upload-provider-item-label {
  color: white;
  font-family: 'Montserrat', sans-serif;
  font-weight: normal;
  font-size: 13px;
  letter-spacing: 1.09px;
  line-height: 23px;
}
</style>