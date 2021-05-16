<template>
    <b-form v-on:submit.prevent="onSubmit" class="login">
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
            class="btn btn-primary mt-6"
            v-bind:disabled="!isValid || status === 'loading'"
        >
            {{ status === "loading" ? "Loading" : "Login" }}
        </button>
        <b-card class="bg-danger mt-3" v-if="status === 'error'">
            <b-card-text>An error occurred. Please try again.</b-card-text>
        </b-card>
        <b-card class="bg-success mt-3" v-if="status === 'fulfilled'">
            <b-card-text>Logged in. Please wait...</b-card-text>
        </b-card>
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
            },
            status: "idle"
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
        this.$data.status = "loading";
        this.axios
            .post(
                "/login",
                {
                    email: this.$data.email.value,
                    password: this.$data.password.value
                },
                this.$store.getters.getAxiosRequestConfig
            )
            .then((response: { data: { token: string; expires: string } }) => {
                this.$store.commit("login", {
                    token: response.data.token,
                    expires: response.data.expires
                });
                this.$data.status = "fulfilled";
            })
            .catch(prodError => {
                this.$data.status = "error";
                this.$router.push("/");

                console.error(prodError);
            });
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
