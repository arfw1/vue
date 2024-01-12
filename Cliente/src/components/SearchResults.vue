<template>
  <div class="text-field-container">
    <v-text-field variant="plain" placeholder="Search products" v-model="palabra_clave"
      @input="handleInput"></v-text-field>
  </div>
  <div class="lista">
        <ul>
            <li v-for="article in items" style="background-color: white; margin-bottom: 10px; border-radius: 10px;">
                <div
                    style="display: flex; height: 100px; width: 100%; justify-content: space-between; align-items: center; padding: 10px;">
                    <RouterLink :to="{ name: 'articleDetails', query: { numArticulo: article.num_articulo } }"
                        style="color: black; font-family: 'Arial', sans-serif; font-weight: bold;">
                        {{ article.nombre }}
                    </RouterLink>
                    <div style="display: flex; align-items: center;">
                        <p style="color: black; font-family: 'Verdana', sans-serif; margin-right: 20px;">{{ article.precio }}€
                        </p>
                        <v-btn @click="eliminarArticulo(article.num_articulo)">Eliminar</v-btn>
                    </div>
                </div>
            </li>
        </ul>
        <p style="color:black;padding-left: 30%;">Still don't see what you need?<RouterLink to="/createArticle">Add your own</RouterLink></p>
    </div>
    <div style="bottom: 0;">
        <button style="color: black; padding-left: 42%; font-family: 'Tahoma', sans-serif;"
            @click="fetchArticles(previousOffset)">Previous</button>
        <button style="color: black; padding-left: 1%; font-family: 'Tahoma', sans-serif;"
            @click="fetchArticles(nextOffset)">Next</button>
    </div>
</template>

<script>
import { useStore } from "../stores/Store.js";
import router from "@/router";
import { RouterLink } from "vue-router";

export default {
    name: "Articles",
    data() {
        return {
            items: [],
            metadatos: {},
            nextOffset: null,
            previousOffset: null,
            palabra_clave: ""
        };
    },
    methods: {
        async fetchArticles(offset) {
            const response = await useStore().buscarArticulos(offset, 5, this.palabra_clave);
            if (response) {
                this.items = response.articulos;
                this.metadatos = response.metadatos;
                this.nextOffset = response.metadatos.nextOffset;
                this.previousOffset = response.metadatos.previousOffset;
            }
        },
        handleInput() {
            this.fetchArticles(0);
        },
        async eliminarArticulo(numArticulo) {
            console.log('entra a method. NumArticulo= ', numArticulo);
            try {
                await useStore().eliminarArticulo(numArticulo);
                router.go(0);
            }
            catch (error) {
                console.log(error);
            }
        }
    },
    mounted() {
        this.fetchArticles(0);
    },
    components: { RouterLink }
};
</script>
<style>
.v-text-field {
  margin: 3%;
  align-content: center;
  align-items: center;
  color: black;
  padding: -5px
}

.text-field-container {
  position: inherit;
  margin: auto;
  margin-top: 3%;
  max-width: 70%;
  background-color: white;
  border-radius: 50px;
  max-height: 40px;
  align-content: center;
  display: flex;

}

button {
  color: black;
  display: inline-block;
}

.lista {
  padding: 5% 10% 0 10%;
  justify-content: center;
  align-items: center;
}</style>
