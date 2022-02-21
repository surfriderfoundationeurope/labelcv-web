<template>
    <UploadForm />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import UploadForm from "../components/upload/UploadForm.vue";
import { mapGetters } from "vuex";

@Component({
    computed: {
        ...mapGetters(["isLoggedIn"])
    },
    components: {
        UploadForm
    }
})
export default class Upload extends Vue {
    isLoggedIn = this.$store.getters.isLoggedIn;
    private mounted(): void {
        if (!this.isLoggedIn) {
            this.$router.push("login");
        }
    }
}
</script>

<style scoped></style>
