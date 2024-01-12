<template>
  <div class="mi-tarjeta">
    <v-card width="400" elevation="16">
      <v-card-title class="text-center">
        Register
      </v-card-title>
      <v-card-text>
        <v-form @submit="manageRegister" :validation-schema="schema" ref="form">
          <v-text-field v-model="usuario" label="Username" :rules="usernameRules" class="white--text"
            outlined></v-text-field>
          <v-text-field v-model="nombre" label="Name" :rules="nameRules" class="white--text" outlined></v-text-field>
          <v-text-field v-model="email" label="Email" :rules="emailRules" class="white--text" outlined></v-text-field>
          <v-text-field v-model="password" label="Password" :rules="passwordRules" class="white--text" outlined
            :type="visible ? 'text' : 'password'">
            <template v-slot:append-inner>
              <v-btn icon @click="togglePasswordVisibility">
                <v-icon>
                  <font-awesome-icon class="fa-xs black--text outline-none" :icon="visible ? 'eye-slash' : 'eye'" />
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
          <v-text-field v-model="password_confirmed" label="Repeat password" :rules="passwordConfirmRules"
            class="white--text" outlined :type="visible ? 'text' : 'password'">
            <template v-slot:append-inner>
              <v-btn icon @click="togglePasswordVisibility">
                <v-icon>
                  <font-awesome-icon class="fa-xs black--text outline-none" :icon="visible ? 'eye-slash' : 'eye'" />
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
          <v-text-field v-model="domicilio" label="Address" :rules="addressRules" class="white--text"
            outlined></v-text-field>
          <v-btn @click="manageRegister" color="primary">Register</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import * as yup from 'yup';
import { useStore } from "../stores/Store.js";
import router from "@/router"
export default defineComponent({
  name: 'Register',
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    const schema = yup.object().shape({
      usuario: yup.string().required('Username is required!'),
      nombre: yup.string().required('Name is required!'),
      email: yup.string().required('Email is required!').email('Enter a valid email address.'),
      password: yup.string().required('Password is required!'),
      password_confirmed: yup.string().required('Repeat password is required').oneOf([yup.ref('password')], 'Passwords must match'),
      domicilio: yup.string().required('Address is required!'),
    });

    const usernameRules = [value => !!value || 'Username is required!'];
    const nameRules = [value => !!value || 'Name is required!'];
    const emailRules = [
      value => !!value || 'Email is required!',
      value => /^\S+@\S+\.\S+$/.test(value) || 'Enter a valid email address.',
    ];
    const passwordRules = [value => !!value || 'Password is required!'];
    const passwordConfirmRules = [
      value => !!value || 'Repeat password is required',
      value => value === this.password || 'Passwords must match',
    ];
    const addressRules = [value => !!value || 'Address is required!'];

    const isFormValid = ref(true);
    return {
      usuario: '',
      nombre: '',
      email: '',
      password: '',
      password_confirmed: '',
      domicilio: '',
      visible: false,
      schema,
      usernameRules,
      nameRules,
      emailRules,
      passwordRules,
      passwordConfirmRules,
      addressRules,
      isFormValid: false,
    };
  },
  methods: {
    async manageRegister(event) {
      event.preventDefault();
      try {
        const result = await this.$refs.form.validate();
        if (result.valid) {
          await this.store.register({
            usuario: this.usuario,
            email: this.email,
            password: this.password,
            nombre: this.nombre,
            domicilio: this.domicilio
          })
          await this.store.login({
            email: this.email,
            password: this.password
          }).then(() => {
            router.push("/");
          });
        }
      } catch (error) {
        this.message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    },
    togglePasswordVisibility() {
      this.visible = !this.visible;
    },
  },
});
</script>

<style>
.mi-tarjeta {
  text-align: center;
  margin: auto;
  margin-top: -5%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10% 0 10% 0;
}

.eye-slash,
.eye {
  color: black--text;
}

v-card-title {
  color: black;
  font-style: bold;
  font-size: x-large;
}

v-card {
  margin-left: 10%;
  flex-direction: column;
}
</style>
