module.exports = {
  mode: 'universal',
  server: {
    port: (process.env.NODE_ENV === 'production' ? 80 : 8080),
    host: '0.0.0.0',
    https_port: 443
  },
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#FFFFFF' },
  /*
  ** Global CSS
  */
  css: [
    '@/assets/custom.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/vue-countdown'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/moment',
    '@nuxtjs/google-analytics'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    '@nuxtjs/axios',
    'bootstrap-vue/nuxt',
    'nuxt-i18n'
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  /*
  ** bootstrap-vue config
  */
  bootstrapVue: {
    icons: true,
    bootstrapCSS: true,
  },
  /*
  ** Axios config
  */
  axios: {
    baseURL: (process.env.NODE_ENV === 'production' ? 'https://arcinfo.eatsteak.xyz' : 'http://localhost:8080')
  },
  env: {
    baseURL: (process.env.NODE_ENV === 'production' ? 'https://arcinfo.eatsteak.xyz' : 'http://localhost:8080')
  },
  /*
  ** PWA config
  */
  pwa: {
    serviceWorker: (process.env.NODE_ENV === 'production'),
    workbox: {
      offline: false
    },
    manifest: {
      name: 'ARCINFO',
      short_name: 'ARCINFO',
      display: 'standalone',
      background_color: '#F48FB1'
    }
  },
  /*
  ** i18n config
  */
  i18n: {
    locales: [{
      code: 'en',
      name: 'English'
    },
    {
      code: 'ko',
      name: '한국어'
    }],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: require('./lang/en.json'),
        ko: require('./lang/ko.json')
      }
    }
  },
  googleAnalytics: {
    id: '---',
    dev: false
  }
}
