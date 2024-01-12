import { defineStore } from 'pinia'
import Service from '../services/Service.js';

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user
  ? { status: { loggedIn: true }, user }
  : { status: { loggedIn: false }, user: null };

export const useStore = defineStore('auth', {
  state: function () {
    return initialState
  },
  actions: {
    async login(user) {
      try {
        var user = await Service.login(user);
        if (user.message != 'Credenciales incorrectas') {
          this.status.loggedIn = true;
          this.user = user;
          return user;
        } else {
          console.log('Algo ha ido mal');
          this.status.loggedIn = false;
          user = null;
          console.log('user1', user);
          return user;
        }
      }
      catch (error) {
      }
    },
    logout() {
      Service.logout();
      this.status.loggedIn = false;
      this.user = null;
    },
    async register(user) {
      var response = await Service.register(user)
      try {
        this.status.loggedIn = false;
        return response.data;
      }
      catch (error) {
        this.status.loggedIn = false;
        throw error;
      }
    },
    async articles(offset, limit = 5) {
      var response = await Service.articulos(offset, limit);
      return { articulos: response.articulos, metadatos: response.metadatos }
    },
    async buscarArticulos(offset, limit = 5, palabra_clave) {
      var response = await Service.buscarArticulos(offset, limit, palabra_clave);
      return { articulos: response.articulos, metadatos: response.metadatos }
    },
    async createArticles(article) {
      try {
        var response = await Service.crearArticulos(user, article);
        return response;
      } catch (error) {
        console.error(error);
      }
    },
    async detallesArticulo(numArticulo) {
      var response = await Service.detallesArticulo(numArticulo);
      return response;
    },

    async editarArticulo(articulo) {
      var response = await Service.editarArticulo(user, articulo);
      return response;
    },

    async eliminarArticulo(numArticulo) {
      var response = await Service.eliminarArticulo(user, numArticulo);
      return response;
    },


  }
})
