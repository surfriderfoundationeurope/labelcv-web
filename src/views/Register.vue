<template>
    <RegisterForm />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import RegisterForm from "../components/register/RegisterForm.vue";
@Component({
    components: {
        RegisterForm
    }
})
export default class Register extends Vue {}
</script>

<style scoped></style>
