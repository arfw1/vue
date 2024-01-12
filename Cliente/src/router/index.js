import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import Articles from '../components/Articles.vue'
import SearchResults from '../components/SearchResults.vue'
import CreateArticle from '../components/CreateArticle.vue'
import ArticleDetails from '../components/ArticleDetails.vue'
import ModifyArticle from '../components/ModifyArticle.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },

    {
      path: '/register',
      name: 'register',
      component: Register
    },

    {
      path: '/',
      name: 'articles',
      component: Articles
    },
    {
      path: '/search',
      name: 'searchResults',
      component: SearchResults
    },

    {
      path: '/createArticle',
      name: 'createArticle',
      component: CreateArticle
    },

    {
      path: '/articleDetails',
      name: 'articleDetails',
      component: ArticleDetails
    },

    {
      path: '/modifyArticle',
      name: 'modifyArticle',
      component: ModifyArticle
    }
  ]
})

export default router
