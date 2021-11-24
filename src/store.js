import Vue from "vue"
import Vuex from "vuex"

import env from "@sc/lib-env"
import url from "url"
import services from "@/services"

const queryData = url.parse(location.href, true).query

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    inApp: env.browser.inApp,
    queryData: queryData,
    baseData: {},
    userLoaded: false,
    userData: {}
  },
  getters: {},
  mutations: {
    setState (state, data) {
      Object.keys(data).forEach(key => {
        if (key in state) {
          state[key] = data[key]
        }
      })
    }
  },
  actions: {
    getBaseData ({ state, commit }) {
      return Promise.resolve()
    },
    getUserByLocalToken ({ state, commit }) {
      console.log("getUserBy")
      return services.user.getUserByLocalToken().then(res => {
        commit("setState", { userData: res, userLoaded: true })
        return res
      })
    },
    setLoginState ({ state, commit }, data = {}) {
      commit("setState", { userData: data })
      services.user.setUserToken(data.uToken)
    }
  }
})
