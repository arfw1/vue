<template>
    <h1 style="padding-top:2%;color: #734c29; font-family: 'Times New Roman', serif;">Todos Nuestros productos</h1>
    <h2 style="color: #734c29; font-family: 'Arial', sans-serif;">Don't see what you are looking for?
        <RouterLink to="search" style="color: #734c29; font-family: 'Verdana', sans-serif;">Search for it!</RouterLink>
    </h2>
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
import { ref, onMounted } from 'vue';
import router from "@/router";
export default {
    name: "Articles",

    setup() {
        const store = useStore();
        const items = ref([]);
        var metadatos = ref({});
        const nextOffset = ref(null);
        const previousOffset = ref(null);
        const fetchArticles = async (offset) => {
            const response = await store.articles(offset);
            if (response) {
                items.value = response.articulos;
                metadatos.value = response.metadatos;
                nextOffset.value = response.metadatos.nextOffset;
                previousOffset.value = response.metadatos.previousOffset;
            }

        };
        const eliminarArticulo = async (numArticulo) => {
            console.log('entra a method. NumArticulo= ', numArticulo);
            try {
                await store.eliminarArticulo(numArticulo)
                router.go(0);
            } catch (error) {
                console.log(error);
            }
        }
        onMounted(() => {
            fetchArticles(0);
        });
        // Retornando 'items' para que esté disponible en el componente
        return { items, metadatos, fetchArticles, nextOffset, previousOffset, eliminarArticulo };
    },
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
}
</style>
