<template>
  <div v-if="!currentUser">
    <title>Tienda Online</title>
    <header class="menu">
      <nav>
        <RouterLink
          style="text-decoration: none; color: antiquewhite; font-weight: bold;padding-left:2%; padding-right: 2%; padding-top: 0.5%;"
          to="/login">Login</RouterLink>
        <RouterLink
          style="text-decoration: none; color: antiquewhite; font-weight: bold; padding-right: 2%;padding-top: 0.5%;"
          to="/register">Register</RouterLink>
        <RouterLink
          style="text-decoration: none; color: antiquewhite; font-weight: bold; padding-right: 2%;padding-top: 0.5%;"
          to="/">Articles</RouterLink>
      </nav>
      <RouterView />
    </header>
  </div>

  <div v-if="currentUser">
    <title>Tienda Online</title>
    <header class="menu">
      <nav style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
        <RouterLink
          style="text-decoration: none; color: antiquewhite; font-weight: bold;padding-left:2%; padding-right: 2%; padding-top: 0.5%;"
          to="/">Articles</RouterLink>
        <v-btn variant="text"
          style="text-decoration: none; color: antiquewhite; font-weight: bold;margin-right: 2%; padding-right: 2%;padding-top: 0.5%;"
          @click="logOut">Logout</v-btn>
      </nav>
      <RouterView />
    </header>
  </div>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import { useStore } from './stores/Store.js'
export default {
  setup() {
    const store = useStore();
    return { store }
  },
  computed: {
    currentUser() {
      return useStore().user;
    }
  },
  methods: {
    logOut() {
      this.store.logout();
      this.$router.push('/login');
    }
  }
}
</script>


<style>
.menu nav {
  display: flex;
  background-color: #333;
  margin: 0;
  width: 100%;
  height: 40px;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

.letra {
  font-weight: bold;
  color: antiquewhite;
}

h1,
h2,
a {
  color: #734c29;
  font-family: 'Times New Roman', serif;
  text-align: center;
}</style>
