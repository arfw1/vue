<template>
    <div>
        <v-card class="mx-auto my-10" max-width="600" elevation="16">
            <v-card-title style="padding-left:30%;padding-top:5%">Edit product information</v-card-title>
            <v-text-field readonly v-model="editedObject.num_articulo" label="Product number"
                style="padding-top:2%"></v-text-field>
            <v-text-field v-model="editedObject.descripcion" :rules="descriptionRules" label="Description"></v-text-field>
            <v-text-field v-model="editedObject.precio" :rules="priceRules" label=Price></v-text-field>
            <v-text-field v-model="editedObject.stock" :rules="stockRules" label=Stock></v-text-field>
            <v-text-field v-model="editedObject.palabra_clave" :rules="keyWordRules" label="Keyword"></v-text-field>
            <v-card-item style="padding-bottom: 5%; padding-left: 40%;">
                <v-btn @click="editarArticulo(editedObject)" color="primary">Enviar</v-btn>
            </v-card-item>
        </v-card>
    </div>
</template>

<script>
import router from '@/router';
import { useStore } from '../stores/Store'
export default {
    data() {
        const nameRules = [value => !!value || 'Product name is required!'];
        const descriptionRules = [value => !!value || 'Description is required!'];
        const stockRules = [
            value => !!value || 'Stock is required!',
            value => (value && value > 0) || 'Stock must be a positive number'
        ];
        const productNumberRules = [
            value => !!value || 'Product number is required!',
            value => (value && value > 0) || 'Product number must be a positive number'
        ];
        const priceRules = [
            value => !!value || 'Price is required!',
            value => (value && value > 0) || 'Price must be a positive number'
        ];
        const keyWordRules = [value => !!value || 'Key word is required!'];

        return {
            editedObject: {}, nameRules, descriptionRules, stockRules, productNumberRules, priceRules, keyWordRules
        }
    },
    created() {
        this.editedObject = JSON.parse(this.$route.query.articulo);
        console.log(this.editedObject);
    },
    methods: {
        editarArticulo(articulo) {
            useStore().editarArticulo(articulo);
            router.push('/');
        }
    }
}

</script>