const loadScript = (() => {
  let promise = null
  return () => {
    if (!promise) {
      promise = new Promise((resolve, reject) => {
        const src = `https://apis.google.com/js/api:client.js`
        const script = document.createElement("script")
        script.onload = () => resolve()
        script.onerror = (e) => {
          promise = null
          reject(e)
        }
        script.src = src
        document.head.appendChild(script)
      })
    }
    return promise
  }
})()

const initAuth2 = (() => {
  let promise = null
  return () => {
    if (!promise) {
      promise = new Promise((resolve, reject) => {
        const gapi = window.gapi
        gapi.load("auth2", () => {
          const auth2 = gapi.auth2.init({
            // client_id: "45644394535-7rv8tgf1sva7im73nu0sphalof6pfvc0.apps.googleusercontent.com", // smartcinemaTV应用新建的
            // client_id: "759513013181-fburs3r03a9a699djdr3b5l35ei9q11f.apps.googleusercontent.com", // smartcinema应用原来的
            client_id: "759513013181-0qqmtp8t75h03eddolab8bgfp5rrkq8p.apps.googleusercontent.com", // smartcinema应用新建的
            cookiepolicy: "single_host_origin",
            scope: "profile"
          })
          resolve(auth2)
        })
      })
    }
    return promise
  }
})()

const bindLoginButton = async (el, success) => {
  await loadScript()
  const auth2 = await initAuth2()
  auth2.attachClickHandler(el, {}, (googleUser) => {
    // const profile = auth2.currentUser.get().getBasicProfile();
    const profile = googleUser.getBasicProfile()
    const token = googleUser.getAuthResponse().id_token // 用于服务端身份验证，获取真实用户信息
    const id = profile.getId()
    const email = profile.getEmail()
    const avatar = profile.getImageUrl()
    const name = profile.getName()
    console.log("Token" + token)
    console.log("ID: " + id)
    console.log("Full Name: " + name)
    console.log("Image URL: " + avatar)
    console.log("Email: " + email)
    success && success({ token, id, email, avatar, name })
  }, function (error) {
    console.log(JSON.stringify(error, undefined, 2))
  })
}

export {
  loadScript,
  bindLoginButton
}

export default {
  loadScript,
  bindLoginButton
}
