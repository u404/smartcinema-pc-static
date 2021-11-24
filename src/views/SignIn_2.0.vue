<template>
  <div class="page_view sign-in" :class="{ 'focus-sc-login': focusScLogin }">
    <div class="btn back-btn" @click="back">{{$i18n._('Back')}}</div>
    <aside class="sign-in_aside">
      <div class="sign-in_aside_tips" v-html="tips || $i18n._('welcome-to')"></div>
      <i class="sign-in_aside_logo"></i>
    </aside>
    <div class="sign-in_main">
      <div class="third-party-group">
        <div class="google-login-button" ref="googleLoginButton" @click="googleLogin">{{$i18n._('google-login')}}</div>
        <div class="facebook-login-button" @click="facebookLogin">{{$i18n._('facebook-login')}}</div>
      </div>

      <div class="split-line">OR</div>

      <div class="sc-login">
        <SignInByEmail v-if="accountType === AccountTypes.Email" @stepChange="onStepChange" @success="data => onSuccess(data, 'email')" @toggle="accountType = AccountTypes.Mobile" />
        <SignInByMobile v-else @stepChange="onStepChange" @success="data => onSuccess(data, 'mobile')" @toggle="accountType = AccountTypes.Email" />
      </div>

      <div class="tips" v-html="$i18n._('agreement-tips').replace('{l1}', SITE_CONFIG.userAgreementLink).replace('{l2}', SITE_CONFIG.privacyLink)">
      </div>
    </div>

  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex"

import facebookSDK from "@/common/lib/facebook-sdk"
import googleSDK from "@/common/lib/google-sdk"

import SignInByEmail from "@/views/SignInByEmail"
import SignInByMobile from "@/views/SignInByMobile"

import env from "@sc/lib-env"
import services from "@/services"
import logger from "@/logger"

import { SITE_CONFIG } from "@/define"

const AccountTypes = {
  Email: 0,
  Mobile: 1
}

export default {
  components: {
    SignInByEmail,
    SignInByMobile
  },

  props: {
    code: {
      type: String,
      default: ""
    }
  },

  data () {
    return {
      focusScLogin: false,

      tips: "",

      SITE_CONFIG,

      accountType: SITE_CONFIG.signInMobileFirst ? AccountTypes.Mobile : AccountTypes.Email,
      AccountTypes
    }
  },

  computed: {
    ...mapState(["queryData"])
  },

  methods: {
    ...mapMutations(["setState"]),
    ...mapActions(["setLoginState"]),

    log (event, data) {
      logger.log(event, data)
    },
    initGoogleLogin () {
      googleSDK.bindLoginButton(this.$refs.googleLoginButton, ({ token }) => {
        this.$loading()
        services.user.authLogin(token, 58).then(res => {
          this.$loading.close()
          this.onSuccess(res, "google")
        }).catch(() => {
          this.$loading.close()
        })
      })
    },
    googleLogin () {
      this.log("login_page_google")
    },
    async facebookLogin () {
      this.log("login_page_facebook")
      const { token } = await facebookSDK.login()
      try {
        this.$loading()
        const res = await services.user.authLogin(token, 57)
        this.$loading.close()
        this.onSuccess(res, "facebook")
      } catch (e) {
        this.$loading.close()
      }
    },

    onStepChange ({ value, isSignIn, isSignUp }) {
      if (value > 0) {
        this.focusScLogin = true
        if (isSignIn) {
          this.tips = this.$i18n._("Welcome Back")
        } else if (isSignUp) {
          this.tips = this.$i18n._("Create your Account")
        } else {
          this.tips = ""
        }
      } else {
        this.focusScLogin = false
        this.tips = ""
      }
    },

    onSuccess (data, type) {
      this.setLoginState(data)
      services.clearCache()
      this.routerBack()
      this.log("global_login_result", { type })
    },

    routerBack () {
      const { from } = this.queryData
      if (from) {
        location.replace(decodeURIComponent(from))
        return
      }
      location.replace(location.origin + { "prod": "", "local": "index.html", "test": "/web.html" }[env.env])
    },

    back () {
      this.log("login_page_back")
      history.back()
    }
  },

  mounted () {
    this.log("login_page")
    this.initGoogleLogin()
  },

  beforeDestroy () {

  }
}
</script>

<style lang="scss" scoped>
.sign-in {
  min-height: 100vh;
  background: #ffffff;
  @include flex($ali: stretch);

  .back-btn {
    position: fixed;
    top: 36px;
    left: 50px;
    z-index: 10;
    width: 100px;
    height: 40px;
    border-radius: 40px;
    @include flex($jus: center);
    background: rgba(255, 255, 255, 0.18);
    color: #ffffff;
    @include font(20, 28);
    &::before {
      content: "";
      margin-right: 6px;
      width: 22px;
      height: 22px;
      background: url(https://g.smartcinemausa.com/images/e826178708104a1b970f2c3b301a67b8-22-22.png) center no-repeat;
      background-size: contain;
    }
  }

  &_aside {
    flex: 1 1 auto;
    width: 50%;
    background: url(https://g.smartcinemausa.com/images/89c84efd66f14028b25b2148ccd9eddc-960-1080.png) center no-repeat;
    background-size: cover;
    position: relative;
    @include flex($jus: center);

    &_tips {
      margin-top: -50px;
      text-align: center;
      font-size: 30px;
      @include fontPuhui;
      line-height: 56px;
      color: #ffffff;
      text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.02);
    }
    &_logo {
      position: absolute;
      left: 50%;
      margin-left: -82px;
      bottom: 90px;
      width: 164px;
      height: 67px;
      background: url(https://g.smartcinemausa.com/images/e3dc14926884426995f657172e929ca4-164-67.png) center no-repeat;
    }

  }
  &_main {
    flex: 1 0 auto;
    width: 50%;
    overflow: hidden;
    @include flex(column, center, center);
  }

  .google-login-button {
    width: 390px;
    height: 50px;
    padding-left: 71px;
    border: 1px solid #999999;
    border-radius: 50px;
    @include flex($jus: flex-start);
    background: url(https://g.smartcinemausa.com/images/cf841184588d4678835f412b68d2f72b-32-32.png) left 20px center no-repeat;
    background-size: 32px;
    @include font(18, 25);
    font-weight: 500;
    color: #121212;
    cursor: pointer;
  }
  .facebook-login-button {
    margin-top: 16px;
    width: 390px;
    height: 50px;
    padding-left: 71px;
    border-radius: 50px;
    @include flex($jus: flex-start);
    background: #4267B2 url(https://g.smartcinemausa.com/images/221a1e0423354f73af56f38a04efa871-32-32.png) left 20px center no-repeat;
    background-size: 32px;
    @include font(18, 25);
    font-weight: 500;
    color: #ffffff;
    cursor: pointer;
  }
  .split-line {
    margin-top: 66px;
    margin-bottom: 54px;
    @include flex($jus: center);
    @include font(14, 20);
    color: #999999;
    &::before, &::after {
      content: "";
      margin: 0 10px;
      width: 239px;
      height: 1px;
      background: #ebebeb;
    }
  }
  .tips {
    margin-top: 43px;
    width: 352px;
    @include font(14, 20);
    color: #777777;
    a {
      color: inherit;
      text-decoration: underline;
    }
  }

  &.focus-sc-login {
    .back-btn {
      display: none;
    }
    .sign-in_main>:not(.sc-login) {
      display: none;
    }
  }

}

@include screen-mobile {
  .sign-in {
    display: block;
    padding-bottom: rem(40);
    .back-btn { display: none; }

    &_aside {
      width: auto;
      padding: rem(58) 0 rem(40);
      background: none;
      &_tips {
        margin-top: 0;
        @include font-m(22, 28);
        font-weight: 600;
        color: #121212;
        text-shadow: 0px rem(2) rem(4) rgba(0, 0, 0, 0.02);
      }
      &_logo {
        display: none;
      }
    }
    &_main {
      width: auto;
    }

    .google-login-button {
      width: rem(280);
      height: rem(44);
      padding-left: rem(66);
      background-position: left rem(30) center;
      background-size: rem(24);
      @include font-m(15, 21);
    }
    .facebook-login-button {
      width: rem(280);
      height: rem(44);
      padding-left: rem(66);
      background-position: left rem(30) center;
      background-size: rem(24);
      @include font-m(15, 21);
    }
    .split-line {
      margin-top: rem(36);
      margin-bottom: rem(30);
      @include font-m(14, 20);
      &::before, &::after {
        width: rem(150);
      }
    }
    .tips {
      margin-top: rem(87);
      text-align: center;
      @include font-m(12, 20);
    }
  }

}
</style>
