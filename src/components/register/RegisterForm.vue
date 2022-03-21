<template>
    <b-form v-on:submit.prevent="onSubmit" class="register">
        <h1 class="field_title">Create my account</h1>
        <div class="field">
            <label class="field__label" for="first_name">First name</label>
            <b-form-input
                id="first_name"
                type="text"
                autocomplete
                class="field__input"
                @focus="resetError()"
                @blur="check('first_name')"
                v-model="firstname.value"
            />
        </div>
        <div class="field">
            <label class="field__label" for="last_name">Last name</label>
            <b-form-input
                id="last_name"
                type="text"
                autocomplete
                class="field__input"
                @focus="resetError()"
                @blur="check('last_name')"
                v-model="lastname.value"
            />
        </div>
        <div class="field">
            <label class="field__label" for="birth">Date of birth</label>
            <b-form-datepicker
                id="birth"
                type="text"
                placeholder="DD-MM-YYYY"
                autocomplete
                class="mb-3"
                @focus="resetError()"
                @blur="check('birth')"
                v-model="birthday.value"
            />
        </div>

        <div class="field">
            <label class="field__label" for="email">Email</label>
            <b-form-input
                id="email"
                type="email"
                autocomplete="username"
                aria-describedby="email-constraints"
                required
                aria-required="true"
                class="field__input"
                @focus="resetError()"
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
                @focus="resetError()"
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
        <div class="field">
            <label class="field__label" for="password2">Confirm password</label>
            <b-form-input
                id="password2"
                type="password"
                autocomplete="current-password"
                aria-describedby="password-constraints"
                required
                aria-required="true"
                class="field__input"
                @focus="resetError()"
                @blur="check('confirm_password')"
                v-model="confirmpassword.value"
            />
            <p
                id="password-constraints"
                class="field__error"
                v-if="hasError('password')"
            >
                Please, confirm your password
            </p>
        </div>
        <div class="field">
            <input type="checkbox" id="checkbox" v-model="checked" />
            <label>
                I have read and accept the
                <a
                    target="_blank"
                    class="field__action"
                    href="https://www.plasticorigins.eu/CGU"
                    >Terms of use and Privacy Policy
                </a>
            </label>
        </div>
        <button
            type="submit"
            class="btn btn-primary mt-6"
            v-bind:disabled="!isValid || status === 'loading'"
        >
            {{ status === "loading" ? "Loading" : "Register" }}
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
export default class RegistreForm extends Vue {
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
            firstname: {
                error: false,
                value: ""
            },
            lastname: {
                error: false,
                value: ""
            },
            birthday: {
                error: false,
                value: ""
            },
            confirmpassword: {
                value: ""
            },
            status: "idle"
        };
    }

    get isValid(): boolean {
        return !!(
            this.$data.email.value &&
            this.$data.password.value &&
            this.$data.firstname.value &&
            this.$data.lastname.value &&
            this.$data.birthday.value &&
            this.$data.confirmpassword.value
        );
    }

    private hasError(
        input:
            | "email"
            | "password"
            | "firstname"
            | "lastname"
            | "birthday"
            | "confirmpassword"
    ): boolean {
        return !!(this.$data[input].error && !this.$data[input].value);
    }

    private check(
        input:
            | "email"
            | "password"
            | "firstname"
            | "lastname"
            | "birthday"
            | "confirmpassword"
    ) {
        switch (input) {
            case "confirmpassword":
                if (
                    this.$data[input].value === "" ||
                    this.$data[input].value !== this.$data.password.value
                ) {
                    this.$data[input].error = true;
                }
        }
        if (this.$data[input].value === "") {
            this.$data[input].error = true;
        }
    }

    private resetError() {
        this.$data.status = "idle";
    }

    private onSubmit() {
        this.$data.status = "loading";
        const register = this.$store.dispatch("register", {
            email: this.$data.email.value,
            password: this.$data.password.value,
            name: this.$data.name.value,
            birthday: this.$data.birthday.value
        });
        register
            .then((response: { data: { token: string; expires: string } }) => {
                this.$store.commit("authenticate", {
                    token: response.data.token,
                    expires: response.data.expires
                });
                this.$data.status = "fulfilled";
                setTimeout(() => {
                    this.$router.push("/");
                }, 3000);
            })
            .catch(prodError => {
                this.$data.status = "error";
                console.error(prodError);
            });
    }
}
</script>

<style>
.register {
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
