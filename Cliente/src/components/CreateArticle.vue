<template>
  <div class="mi-tarjeta">
    <v-card width="400">
      <v-card-title class="text-center">
        Create a new article
      </v-card-title>
      <v-card-text>
        <v-form @submit="manageRegister" :validation-schema="schema" ref="form">
          <v-text-field v-model.number="article.productNumber" label="Product number" :rules="productNumberRules"
            class="white--text" outlined></v-text-field>
          <v-text-field v-model="article.name" label="Name" :rules="nameRules" class="white--text"
            outlined></v-text-field>
          <v-text-field v-model="article.description" label="Description" :rules="descriptionRules" class="white--text"
            outlined></v-text-field>
          <v-text-field v-model="article.keyWord" label="Key word" :rules="keyWordRules" class="white--text"
            outlined></v-text-field>
          <v-text-field v-model.number="article.stock" label="Stock" :rules="stockRules" class="white--text" outlined
            type="number"></v-text-field>
          <v-text-field v-model.number="article.price" label="Price" :rules="priceRules" class="white--text" outlined
            type="number"></v-text-field>
          <v-btn @click="manageCreation" color="primary">Create Article</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
  
<script>
import router from '@/router';
import { defineComponent, ref } from 'vue';
import * as yup from 'yup';
import { useStore } from "../stores/Store.js";
export default defineComponent({
  name: 'Register',
  setup() {
    const store = useStore();
    return { store };
  },
  data() {
    const schema = yup.object().shape({
      name: yup.string().required('Article name is required!'),
      description: yup.string().required('Description is required!'),
      keyWord: yup.string().required('Key word is required!'),
      stock: yup.string().required('Stock is required!'),
      price: yup.string().required('Price is required!'),
      productNumberRules: yup.string().required('Product number is required!')
    });

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
    const isFormValid = ref(true);
    return {
      article: {
        name: '',
        description: '',
        price: '',
        stock: '',
        keyWord: '',
        productNumber: ''
      },
      schema,
      nameRules,
      descriptionRules,
      stockRules,
      priceRules,
      keyWordRules,
      productNumberRules,
      isFormValid: false,

    };
  },
  methods: {
    async manageCreation(event) {
      event.preventDefault();
      try {
        const result = await this.$refs.form.validate();
        if (result.valid) {
          await this.store.createArticles(this.article).then
          console.log("changing route");
          setTimeout(() => {
        router.push("/");
      }, 1000);
        };
      
        
      } catch (error) {
        console.error(error);
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
}</style>
  