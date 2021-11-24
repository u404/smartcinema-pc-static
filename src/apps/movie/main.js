import "@/common/style/reset.scss"

import disableConsole from "@/common/lib/disable-console.js"

import "@sc/lib-web-utils-intl" // 引入一系列扩展方法

import Vue from "vue"

import plugins from "@/plugins"

import App from "./App.vue"

import regionLocale from "@sc/lib-region-locale"
import locales from "./locales.js"

disableConsole()

Vue.use(regionLocale, { locales, defaultLocale: "en_US" })

Vue.use(plugins)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount("#app")

console.log("webviewSize", window.innerWidth, window.innerHeight)
