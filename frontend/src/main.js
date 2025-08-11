import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import axios from './plugins/axios'

// Глобальные стили
import './styles/global.css'

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(axios)

app.mount('#app')
