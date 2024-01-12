<template>
    <div>
        <v-card v-if="Articulo" class="mx-auto my-8" max-width="344" elevation="16">
            <v-card-item class="justify-left">
                <v-card-title>{{ Articulo.nombre }}</v-card-title>
                <v-card-subtitle>{{ Articulo.descripcion }}</v-card-subtitle>
                <v-card-text>We have {{ Articulo.stock }} left!</v-card-text>
                <v-card-text>€{{ Articulo.precio }}</v-card-text>
                <v-card-text>Product number: {{ Articulo.num_articulo }}</v-card-text>
                <v-card-text>Key Word: {{ Articulo.palabra_clave }}</v-card-text>
            </v-card-item>
            <v-card-item style="display:flex;align-items: left">
                <v-card-text>Something wrong? <RouterLink class="link"
                        :to="{ name: 'modifyArticle', query: { articulo: JSON.stringify(Articulo) } }">Modify</RouterLink>
                    </v-card-text>

            </v-card-item>
        </v-card>
    </div>
</template>

<script>
import { useStore } from "../stores/Store.js";
export default {
    data() {
        return {
            Articulo: null,
            numeroArticulo: null,
        };
    },
    async mounted() {
        this.numeroArticulo = JSON.parse(this.$route.query.numArticulo || null)
        const response = await useStore().detallesArticulo(this.numeroArticulo);
        this.Articulo = response;
        console.log('HOLA', this.Articulo);
    }
}
</script>

<style>
.link {
    font-weight: 100;
    color: black;
}
</style>