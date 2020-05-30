<template>
  <div id="upload">
    <div id="upload-provider" v-if="!uploading">
      <ul class="upload-provider-list">
        <li
          class="upload-provider-item"
          v-for="provider in providers"
          v-bind:key="provider"
          @click="onClick(provider)">
          <img
            class="upload-provider-item-icon"
            :src="`/images/providers/${provider.toLowerCase()}.png`"
          />
          <div class="upload-provider-item-label">{{ provider }}</div>
        </li>
      </ul>
    </div>
    <div id="upload-provider-container"></div>
    <div id="upload-progress" v-if="uploading">
      <div class="upload-progress-label">{{ progress }}%</div>
      <div class="upload-progress-bar">
        <div class="progress"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import { imageProviderService } from '@/services/provider';
import { uploadService } from '@/services/upload';

@Component({})
export default class Upload extends Vue {
  /** Flag that indicates if currently uploading. */
  private uploading: boolean;

  /** */
  private progress: number;

  /** List of supported image provider. */
  private providers: string[];

  /** Default constructor. */
  constructor() {
    super();
    this.providers = imageProviderService.getAvailableImageProvider();
    this.progress = 0;
    this.uploading = false;
  }

  private mounted(): void {
    imageProviderService.register('#upload-provider-container');
    // eventService.on(Event.UPLOADING, this.onUploadingEvent);
    // eventService.on(Event.UPLOADED, this.onUploadedEvent);
  }

  private onUploadingEvent() {
    this.uploading = true;
    // TODO: update progress
  }

  private onUploadedEvent() {
    this.uploading = false;
  }

  /**
   * Provider click listener method.
   *
   * @param provider Target provider that has been clicked.
   */
  private async onClick(provider: string) {
    const imageProvider = imageProviderService.getImageProvider(provider);
    if (imageProvider) {
      const descriptors = await imageProvider.getImages();
      const unit = 100 / descriptors.length;
      for (const descriptor of descriptors) {
        // TODO: Consider adding monitoring.
        uploadService.upload(descriptor);
      }
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
  font-family: "Montserrat", sans-serif;
  font-weight: normal;
  font-size: 13px;
  letter-spacing: 1.09px;
  line-height: 23px;
}

#upload-provider-container {
  display: none;
}

.upload-progress-bar {
  width: 100%;
  height: 3px;
  background: rgb(100, 100, 100);
}

.upload-progress-bar .progress {
  width: 0%;
  height: 100%;
  background: rgb(200, 200, 200);
}
</style>