<template>
    <b-form @submit="onSubmit" class="login">
        <div class="field">
            <label class="field__label" for="email">Email</label>
            <b-form-input
                id="email"
                type="email"
                placeholder=" "
                autocomplete="username"
                aria-describedby="email-constraints"
                required
                aria-required="true"
                class="field__input"
                @blur="check('email')"
                v-model="email.value"
            />
            <p
                id="email-constraints"
                class="field__error"
                v-if="hasError('email')"
            >
                Email is required
            </p>
        </div>
        <div class="field">
            <label class="field__label" for="password">Password</label>
            <b-form-input
                id="password"
                type="password"
                autocomplete="current-password"
                aria-describedby="password-constraints"
                required
                aria-required="true"
                class="field__input"
                @blur="check('password')"
                v-model="password.value"
            />
            <p
                id="password-constraints"
                class="field__error"
                v-if="hasError('password')"
            >
                Password is required
            </p>
        </div>
        <button
            type="submit"
            class="btn btn-primary"
            v-bind:disabled="!isValid"
        >
            Login
        </button>
    </b-form>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class LoginForm extends Vue {
    data() {
        return {
            email: {
                error: false,
                value: ""
            },
            password: {
                error: false,
                value: ""
            }
        };
    }

    get isValid(): boolean {
        return !!(this.$data.email.value && this.$data.password.value);
    }

    private hasError(input: "email" | "password"): boolean {
        return !!(this.$data[input].error && !this.$data[input].value);
    }

    private check(input: "email" | "password") {
        if (this.$data[input].value === "") {
            this.$data[input].error = true;
        }
    }

    private onSubmit() {
        console.log(this.$data.email);
        // this.password && this.login;
    }
}
</script>

<style>
.login {
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
