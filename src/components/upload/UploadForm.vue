<template>
    <b-form v-on:submit.prevent="onSubmit" class="upload">
        <div class="field">
            <label class="field__label" for="file-upload">Select image</label>

            <b-form-file
                id="file-upload"
                v-model="file"
                :state="Boolean(file)"
                placeholder="Choose a file or drop it here..."
                drop-placeholder="Drop file here..."
                accept=".jpg, .png, .gif"
                required
            />
            <div class="mt-3" v-if="Boolean(file)">
                Selected file:
                <span v-if="file">
                    {{ file.name }}
                </span>
            </div>
        </div>

        <button
            type="submit"
            class="btn btn-primary mt-6"
            v-bind:disabled="!isValid || status === 'loading'"
        >
            {{ status === "loading" ? "Loading" : "Upload" }}
        </button>
        <b-card class="bg-danger mt-3" v-if="status === 'error'">
            <b-card-text>An error occurred. Please try again.</b-card-text>
        </b-card>
        <b-card class="bg-success mt-3" v-if="status === 'fulfilled'">
            <b-card-text>You file has been successfully uploaded !</b-card-text>
        </b-card>
    </b-form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
@Component({})
export default class UploadForm extends Vue {
    data() {
        return {
            file: null,
            status: "idle"
        };
    }

    get isValid(): boolean {
        return !!this.$data.file;
    }

    private onSubmit() {
        this.$data.status = "loading";
        const upload = this.$store.dispatch("upload", this.$data.file);
        upload
            .then(() => {
                this.$data.status = "fulfilled";
            })
            .catch((prodError) => {
                this.$data.status = "error";
                console.error(prodError);
            });
    }
}
</script>

<style>
.upload {
    min-height: 100%;
    max-width: 320px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
}
.field {
    display: block;
    margin: 0 0 16px 0;
}
.field__label {
    display: block;
}

.field__error {
    color: var(--danger);
    margin: 4px 0 0 0;
}
</style>
