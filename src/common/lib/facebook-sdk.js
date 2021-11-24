let FB = window.FB

let initPromise = null

// const appId = "310076397564803" // 北美
// const appId = "831509260860111" // 台湾

const init = (appId = "310076397564803") => {
  if (!initPromise) {
    initPromise = new Promise((resolve, reject) => {
      window.fbAsyncInit = function () {
        FB = window.FB
        FB.init({
          appId,
          cookie: true,
          xfbml: true,
          version: "v11.0"
        })

        resolve(FB)
      };

      (function (d, s, id) {
        var js; var fjs = d.getElementsByTagName(s)[0]
        if (d.getElementById(id)) { return }
        js = d.createElement(s); js.id = id
        js.src = "https://connect.facebook.net/en_US/sdk.js"
        fjs.parentNode.insertBefore(js, fjs)
      }(document, "script", "facebook-jssdk"))
    })

    initPromise.then(() => {
      FB.AppEvents.logPageView() // 埋点事件
    })
  }
  return initPromise
}

const login = async () => {
  await initPromise
  return new Promise((resolve, reject) => {
    FB.login(function (response) {
      if (response.status === "connected") {
        // Logged into your webpage and Facebook.
        // Response 中的字段：
        // {
        //     status: 'connected',  // 成功状态
        //     authResponse: {
        //         accessToken: '...',
        //         expiresIn:'...',
        //         signedRequest:'...',
        //         userID:'...'
        //     }
        // }
        console.log("facebook login success-----", response.authResponse)
        const { accessToken, userID } = response.authResponse
        resolve({ token: accessToken, id: userID })
      } else {
        // The person is not logged into your webpage or we are unable to tell.
        console.log("facebook login err----", response)
        reject(response)
      }
    }, { scope: "public_profile,email" }) // 列出需要的权限，权限列表：https://developers.facebook.com/docs/permissions/reference
  })
}

const getLoginStatus = async () => {
  await initPromise
  return new Promise((resolve, reject) => {
    FB.getLoginStatus(function (response) {
      resolve(response)
    })
  })
}

const logPv = async () => {
  await initPromise
  FB.AppEvents.logPageView()
}

const logEvent = async (name, data) => {
  await initPromise
  FB.AppEvents.logEvent(name, data)
}

export { login, getLoginStatus, logPv, logEvent }

export default {
  init,
  login,
  getLoginStatus
}
