<template>
    <b-form v-on:submit.prevent="onSubmit" class="register">
        <h1 class="field_title">Create my account</h1>
        <div class="field">
            <label class="field__label" for="firstname">First name</label>
            <b-form-input
                id="firstname"
                type="text"
                autocomplete
                class="field__input"
                aria-required="true"
                aria-describedby="firstname-constraints"
                @focus="resetError()"
                @blur="check('firstname')"
                v-model="firstname.value"
            />
            <p
                id="firstname-constraints"
                class="field__error"
                v-if="hasError('firstname')"
            >
                Firstname is required
            </p>
        </div>
        <div class="field">
            <label class="field__label" for="lastname">Last name</label>
            <b-form-input
                id="lastname"
                type="text"
                autocomplete
                class="field__input"
                aria-required="true"
                aria-describedby="lastname-constraints"
                @focus="resetError()"
                @blur="check('lastname')"
                v-model="lastname.value"
            />
            <p
                id="lastname-constraints"
                class="field__error"
                v-if="hasError('lastname')"
            >
                Lastname is required
            </p>
        </div>

        <div class="field">
            <label class="field__label" for="email">Email</label>
            <b-form-input
                id="email"
                type="email"
                autocomplete="username"
                aria-required="true"
                aria-describedby="email-constraints"
                required
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
            <label class="field__label" for="confirmpassword"
                >Confirm password</label
            >
            <b-form-input
                id="confirmpassword"
                type="password"
                autocomplete="current-password"
                aria-required="true"
                aria-describedby="confirmpassword-constraints"
                required
                class="field__input"
                @focus="resetError()"
                @blur="check('confirmpassword')"
                v-model="confirmpassword.value"
            />
            <p
                id="confirmpassword-constraints"
                class="field__error"
                v-if="hasError('confirmpassword')"
            >
                Password must be the same
            </p>
        </div>
        <div class="field">
            <b-form-checkbox
                id="cgu"
                v-model="cgu.value"
                name="cgu"
                required
                unchecked-value="false"
                aria-required="true"
                aria-describedby="cgu-constraints"
                @focus="resetError()"
                @blur="check('cgu')"
            >
                I have read and accept the
                <a
                    target="_blank"
                    class="field__action"
                    href="https://www.plasticorigins.eu/CGU"
                    >Terms of use and Privacy Policy
                </a>
            </b-form-checkbox>
            <p id="cgu-constraints" class="field__error" v-if="hasError('cgu')">
                You must accept our terms and privacy policy
            </p>
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
            confirmpassword: {
                error: false,
                value: ""
            },
            cgu: {
                error: false,
                value: "false"
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
            this.$data.confirmpassword.value &&
            this.$data.cgu.value === true
        );
    }

    private hasError(
        input:
            | "email"
            | "password"
            | "firstname"
            | "lastname"
            | "confirmpassword"
            | "cgu"
    ): boolean {
        switch (input) {
            case "cgu":
                return !!(
                    this.$data[input].error && this.$data[input].value !== true
                );
            default:
                return !!(this.$data[input].error && !this.$data[input].value);
        }
    }

    private check(
        input:
            | "email"
            | "password"
            | "firstname"
            | "lastname"
            | "confirmpassword"
            | "cgu"
    ) {
        switch (input) {
            case "confirmpassword":
                if (
                    this.$data[input].value === "" ||
                    this.$data[input].value !== this.$data.password.value
                ) {
                    this.$data[input].error = true;
                }
                break;
            case "cgu":
                if (this.$data[input].value !== true) {
                    this.$data[input].error = true;
                }
                break;
            default:
                if (this.$data[input].value === "") {
                    this.$data[input].error = true;
                }
                break;
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
            lastname: this.$data.lastname.value,
            firstname: this.$data.firstname.value,
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
