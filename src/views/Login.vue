<template>
    <LoginForm />
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import LoginForm from "../components/login/LoginForm.vue";
@Component({
    components: {
        LoginForm
    }
})
export default class Login extends Vue {}
</script>

<style scoped></style>
