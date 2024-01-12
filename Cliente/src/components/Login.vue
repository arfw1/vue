<template>
  <div class="mi-tarjeta">
    <v-card width="400" elevation="16">
      <v-card-title class="text-center">Login</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="manageLogin" :validation-schema="schema">
          <v-text-field v-model="email" label="Email" class="white--text" outlined :rules="['required']"
            :class="{ shake: shakeAnimation }"></v-text-field>
          <v-text-field v-model="password" label="Password" :rules="['required']" class="white--text" outlined
            :type="visible ? 'text' : 'password'" :class="{ shake: shakeAnimation }">
            <template v-slot:append-inner>
              <v-btn icon @click="togglePasswordVisibility">
                <v-icon>
                  <font-awesome-icon class="fa-xs;black--text;outline:none;" :icon="visible ? 'eye-slash' : 'eye'" />
                </v-icon>
              </v-btn>
            </template>
          </v-text-field>
          <v-btn type="submit" color="primary">Iniciar Sesión</v-btn>
          <div style="height: 10px"></div>
          <router-link to="register">Register</router-link>

          <!-- Mensaje de credenciales incorrectas -->
          <div v-if="loginAttempted && loginResult === null" class="error-message">
            Credenciales incorrectas.
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "../stores/Store.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import * as yup from "yup";
import { useRouter } from "vue-router";

library.add(faEye, faEyeSlash);

export default {
  name: "Login",
  components: {
    FontAwesomeIcon,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const visible = ref(false);
    const loginResult = ref(null);
    const shakeAnimation = ref(false);
    const loginAttempted = ref(false);

    const schema = yup.object().shape({
      email: yup.string().required("Email is required!"),
      password: yup.string().required("Password is required!"),
    });

    const manageLogin = async () => {
      loginAttempted.value = true; // Indica que se ha intentado iniciar sesión

      try {
        loginResult.value = await store.login({
          email: email.value,
          password: password.value,
        });

        if (loginResult.value === null) {
          // Si el resultado del login es null, agitar los campos
          shakeAnimation.value = true;

          // Después de un tiempo, quitar la clase shake
          setTimeout(() => {
            shakeAnimation.value = false;
          }, 500);
        }else{
          router.push("/");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const togglePasswordVisibility = () => {
      visible.value = !visible.value;
    };

    return {
      email,
      password,
      visible,
      manageLogin,
      togglePasswordVisibility,
      loginResult,
      schema,
      shakeAnimation,
      loginAttempted,
    };
  },
};
</script>

<style>
.mi-tarjeta {
  text-align: center;
  margin: auto;
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

.shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }

  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}
</style>
