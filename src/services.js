import axios from "@sc/lib-axios"

import env from "@sc/lib-env"

const user = {

  data: null,

  baseParams: {},

  getUserByLocalTokenPromise: null,
  getTempUserPromise: null,

  getLocalToken () {
    return window.localStorage.getItem("token")
  },

  setUserToken (uToken, cache = true) {
    if (cache) {
      if (uToken) {
        window.localStorage.setItem("token", uToken)
      } else {
        window.localStorage.removeItem("token")
      }
    }
    axios.setUserToken(uToken)
  },

  getTempUser () {
    if (!user.getTempUserPromise) {
      user.getTempUserPromise = axios.post("/user/deviceLogin", { ...user.baseParams, uMbtype: env.os.isMobile ? 52 : 51, uLgtype: 20 }).then((res) => {
        user.data = res
        axios.setUserToken(res.uToken)
        return res
      }).catch((err) => {
        user.getTempUserPromise = null
        throw err
      })
    }
    return user.getTempUserPromise
  },

  getUserByLocalToken () {
    if (!user.getUserByLocalTokenPromise) {
      user.getUserByLocalTokenPromise = new window.Promise((resolve) => {
        const uToken = window.localStorage.getItem("token")
        if (uToken) {
          user.getUserByToken(uToken).then(resolve)
        } else {
          user.setUserToken()
          resolve({})
        }
      })
    }
    return user.getUserByLocalTokenPromise
  },

  async forceUser () {
    if (user.data) return
    await user.getUserByLocalToken()
    if (user.data) return
    await user.getTempUser()
    if (!user.data) {
      throw new Error("Network Error")
    }
  },

  setBaseParams (params = {}) {
    user.baseParams = params
  },

  getUserByToken (uToken) {
    return axios.post("/user/web/h5/getUserByToken", {}, { headers: { Authorization: uToken } }).then((res) => {
      user.setUserToken(uToken)
      user.data = res
      return { uToken, ...res }
    }).catch((e) => {
      user.setUserToken()
      console.error("getUserByToken", e)
      return {}
    })
  },

  emailLogin (uEmail, uPassword) {
    return axios.post("/user/passwordLogin", { ...user.baseParams, uEmail, uPassword, uLgtype: 7, uMbtype: env.os.isMobile ? 52 : 51 }).then(res => {
      user.data = res
      return res
    })
  },

  checkEmailExist (uEmail) {
    return axios.get("/user/checkEmail", { uEmail })
  },

  emailSendCode (uEmail) {
    return axios.post("/user/sendEmailCode", { uEmail, sendType: 2 })
  },

  emailRegist (uEmail, uCode, uPassword) {
    return axios.post("/user/emailCodeRegister", { ...user.baseParams, uEmail, uCode, uPassword, uMbtype: env.os.isMobile ? 52 : 51 }).then(res => {
      user.data = res
      return res
    })
  },

  mobileSendCode (uMobile, uAreaCode) {
    return axios.post("/user/sendCode", { uMobile, uAreaCode, sendType: 2 })
  },

  mobileLogin (uMobile, uCode, uAreaCode) {
    return axios.post("/user/web/h5/smsLogin", { ...user.baseParams, uMobile, uCode, uAreaCode, sendType: 1, uMbtype: env.os.isMobile ? 52 : 51 }).then(res => {
      user.data = res
      return res
    })
  },

  authLogin (token, uLgtype) {
    return axios.post("/user/authWebLogin", { ...user.baseParams, token, uLgtype, uMbtype: env.os.isMobile ? 52 : 51 })
  }

}

axios.setUserToken(user.getLocalToken())

let caches = []

export default {

  setDefaultHeaders (headers) {
    axios.setDefaultHeaders(headers)
  },

  // 获取首页数据（新）
  getHomeData () {
    return axios.post("/index/operation/getIndexInfo", { type: "usPCActivity" })
  },

  async getActivityData (type) {
    await user.forceUser()
    return axios.post("/index/operation/getIndexInfo", { type })
  },

  // 获取影片数据（新）
  async getMovieData (skuId, activityId, ticketChannel = "") {
    await user.forceUser()
    const res = await axios.post("/index/operation/getFilmDetail", { skuId, activityId, ticketChannel })
    return res
  },

  // 上报观影时长
  updatePlayProgress ({ ticketNo, playProgress, reportType }) {
    return axios.post("/playlog/ticket/playFilmProgressUploadWithOutAuth", { ticketNo, playProgress: parseInt(playProgress), reportType })
  },

  getFilmDetail (skuId) {
    return axios.get("/index/vizio/getFilmDetail", { skuId })
  },

  getVizioFilms () {
    return axios.get("/index/vizio/getIndexInfo")
  },

  getVizioUserToken (vizioCode) {
    return axios.post("/user/vizio/user/bind", { code: vizioCode }).then(res => res.uToken)
  },

  getVizioBuyInfo (code) {
    return axios.post("/index/vizio/scanPayCode", { code }).then(res => {
      axios.setUserToken(res.authorization || res.Authorization)
      return res
    })
  },

  user,

  cacheRequest (service, ...args) {
    let cache = caches.find(c => {
      return c.service === service && c.args.every((arg, i) => arg === args[i])
    })

    if (!cache) {
      cache = {
        service,
        args,
        request: this[service](...args)
      }
      caches.push(cache)
    }

    return cache.request
  },

  clearCache () {
    caches = []
  },

  testPost (data) {
    return axios.post("/vizio/test", data)
  }
}
