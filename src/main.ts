import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice'

import App from './App.vue'

import Aura from '@primevue/themes/aura'
import router from './router'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistence'

const pinia = createPinia()

pinia.use(
  createPersistedState({
    storage: sessionStorage,
  }),
)

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: false || 'none',
    },
  },
})

app.use(pinia)
app.use(router)
app.use(ConfirmationService)
app.use(ToastService)
app.use(DialogService)

app.mount('#app')
