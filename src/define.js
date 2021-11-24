import env from "@sc/lib-env"

export const DEFAULT_ICON = "https://g.smartcinema.com.cn/images/d9a30727842b4e83ae6181fb264e8462-160-160.png"

export const SITE_CONFIGS = {
  US: {
    smartcinemaName: "Smart Cinema USA",
    logoClass: "",
    followUs: [
      { link: "https://www.facebook.com/smartcinemausaca", icon: "https://g.smartcinemausa.com/images/10f418d752ba4d16be6afb37d06fc75c-84-84.png" },
      { link: "https://www.instagram.com/smartcinemaus", icon: "https://g.smartcinemausa.com/images/1edde4d360a448fc85ca291b4713f2d5-84-84.png" },
      { link: "https://www.youtube.com/channel/UCy87XREV7-pt2w-z946zMDg", icon: "https://g.smartcinemausa.com/images/a18fc11ae6f64f6abe84d251b89d657e-84-84.png" }
    ],
    userAgreementLink: "https://h5.smartcinemausa.com/agreement.html",
    privacyLink: "https://h5.smartcinemausa.com/privacy.html",
    facebookAppId: "310076397564803",
    AreaList: [
      {
        name: "USA",
        code: "1",
        mobileLength: 10,
        icon: "https://g.smartcinemausa.com/images/dd84b661d1984b39ac2c7245b46ac3c2-60-60.png"
      },
      {
        name: "Canada",
        code: "1",
        mobileLength: 10,
        icon: "https://g.smartcinemausa.com/images/9d70d94aa62c41f19201efee2e2aa379-60-60.png"
      },
      {
        name: "China",
        code: "86",
        mobileLength: 11,
        icon: "https://g.smartcinemausa.com/images/eee52df8847f426db8edec0d4cb0deb4-60-60.png"
      }
    ],
    ad: {
      enabled: false,
      url: ""
    },
    movie: {}
  },
  TW: {
    smartcinemaName: "Smart Cinema TW",
    logoClass: "logo-tw",
    followUs: [
      { link: "https://www.facebook.com/SCTW2019", icon: "https://g.smartcinemausa.com/images/10f418d752ba4d16be6afb37d06fc75c-84-84.png" },
      // { link: "https://www.instagram.com/smartcinemaus", icon: "https://g.smartcinemausa.com/images/1edde4d360a448fc85ca291b4713f2d5-84-84.png" },
      { link: "https://www.youtube.com/channel/UCCjjDUpYMk6oQ4vGQ1AzCkQ", icon: "https://g.smartcinemausa.com/images/a18fc11ae6f64f6abe84d251b89d657e-84-84.png" }
    ],
    hideLinkUs: true,
    hideDownloadLink: true,
    userAgreementLink: "https://h5.smartcinema.com.tw/agreementin.html?_lang=zh_TW",
    privacyLink: "https://h5.smartcinema.com.tw/privacyin.html?_lang=zh_TW",
    facebookAppId: "310076397564803", // 自2021年8月10日后，允许配置多个域名了。 smartcinema TW "831509260860111",
    AreaList: [
      {
        name: "Taiwan",
        code: "886",
        mobileLength: 10,
        icon: "https://g.smartcinemausa.com/images/eee52df8847f426db8edec0d4cb0deb4-60-60.png"
      },
      {
        name: "China",
        code: "86",
        mobileLength: 11,
        icon: "https://g.smartcinemausa.com/images/eee52df8847f426db8edec0d4cb0deb4-60-60.png"
      },
      {
        name: "USA",
        code: "1",
        mobileLength: 10,
        icon: "https://g.smartcinemausa.com/images/dd84b661d1984b39ac2c7245b46ac3c2-60-60.png"
      }
      // {
      //   name: "Canada",
      //   code: "1",
      //   mobileLength: 10,
      //   icon: "https://g.smartcinemausa.com/images/9d70d94aa62c41f19201efee2e2aa379-60-60.png"
      // }
    ],
    AreaSelectorTextStyle: true,
    signInMobileFirst: true,
    ad: {
      enabled: true,
      url: `https://staging.onead.com.tw/gos/vast/1000135?dedicated_pid=1399249`
    },
    movie: {
      ratingDisplay: true,
      ticketAlert: true,
      scrollDownTips: true
    }
  }
}

export const SITE_CONFIG = SITE_CONFIGS[env.browser.overseas] || SITE_CONFIGS["US"]
