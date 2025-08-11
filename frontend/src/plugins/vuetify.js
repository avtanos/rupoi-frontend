import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#2f4b7c',
          secondary: '#3f5e94',
          accent: '#2f9e44',
          error: '#e03131',
          info: '#2196F3',
          success: '#2f9e44',
          warning: '#FFC107',
          background: '#f3f5f7',
          surface: '#ffffff',
          'on-surface': '#1e2a3a',
          'surface-variant': '#e2e8f0',
          muted: '#6b778c'
        }
      }
    }
  },
  defaults: {
    VCard: {
      rounded: 'lg',
      elevation: 2
    },
    VBtn: {
      rounded: 'lg'
    },
    VTextField: {
      rounded: 'lg'
    },
    VSelect: {
      rounded: 'lg'
    }
  }
})
