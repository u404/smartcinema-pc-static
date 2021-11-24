import "@/common/style/reset.scss"

import "@sc/lib-web-utils-intl" // 引入一系列扩展方法

import Vue from "vue"

import env from "@sc/lib-env"

import plugins from "@/plugins"

import store from "./store"

import router from "./router"

import App from "./App.vue"

import regionLocale from "@sc/lib-region-locale"
import locales from "./locales.js"

import services from "@/services"

services.setDefaultHeaders({ platformType: 25 })

const defaultLocales = {
  US: "en_US",
  TW: "zh_TW"
}

Vue.use(regionLocale, { locales, defaultLocale: defaultLocales[env.browser.overseas] || defaultLocales.US })

Vue.use(plugins)

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app")

console.log("webviewSize", window.innerWidth, window.innerHeight)
