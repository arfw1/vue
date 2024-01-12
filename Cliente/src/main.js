import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { FontAwesomeIcon } from './plugins/font-awesome'

const vuetify = createVuetify({
  components,
  directives,
})
createApp(App).use(vuetify).use(createPinia()).use(router).component("font-awesome-icon", FontAwesomeIcon)
.mount('#app')


