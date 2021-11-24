<template>
  <div class="sign-drawer" v-show="visiable" @touchmove.prevent>
    <div class="sign-in" :class="{ 'focus-sc-login': focusScLogin }">
      <div class="btn back-btn" @click.self="back"></div>
      <aside class="sign-in_aside">
        <div class="sign-in_aside_tips" v-html="tips || $i18n._('welcome-to')"></div>
        <!-- <i class="sign-in_aside_logo"></i> -->
      </aside>
      <div class="sign-in_main">
        <div class="third-party-group">
          <div class="google-login-button" @click="googleLogin" ref="googleLoginButton">{{$i18n._('google-login')}}</div>
          <div class="facebook-login-button" @click="facebookLogin">{{$i18n._('facebook-login')}}</div>
        </div>

        <div class="split-line">OR</div>

        <div class="sc-login">
          <SignInByEmailDrawer :tag="tag" v-if="accountType === AccountTypes.Email" @stepChange="onStepChange" @success="data => onSuccess(data, 'email')" @toggle="accountType = AccountTypes.Mobile" />
          <SignInByMobileDrawer :tag="tag" v-else @stepChange="onStepChange" @success="data => onSuccess(data, 'mobile')" @toggle="accountType = AccountTypes.Email" />
        </div>

        <div class="tips" v-html="$i18n._('agreement-tips').replace('{l1}', SITE_CONFIG.userAgreementLink).replace('{l2}', SITE_CONFIG.privacyLink)">
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex"

import facebookSDK from "@/common/lib/facebook-sdk"
import googleSDK from "@/common/lib/google-sdk"

import SignInByEmailDrawer from "@/components/SignInByEmailDrawer"
import SignInByMobileDrawer from "@/components/SignInByMobileDrawer"

import services from "@/services"
import logger from "@/logger"

import { SITE_CONFIG } from "@/define"

const AccountTypes = {
  Email: 0,
  Mobile: 1
}

export default {
  components: {
    SignInByEmailDrawer,
    SignInByMobileDrawer
  },

  props: {
    visiable: {
      type: Boolean,
      default: false
    },
    code: {
      type: String,
      default: ""
    },
    tag: {
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
  watch: {
    visiable (val) {
      if (val) {
        this.log("login_dialog")
      } else {
        this.log("login_dialog_close")
      }
    }
  },
  computed: {
  },

  methods: {
    ...mapMutations(["setState"]),
    ...mapActions(["setLoginState"]),
    log (event, data) {
      logger.log(event, {
        tag: this.tag,
        ...data
      })
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
      this.log("login_dialog_google")
    },
    async facebookLogin () {
      this.log("login_dialog_facebook")
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
      // this.routerBack()
      this.log("global_login_result", { type })
      this.$emit("success")
    },

    // routerBack () {
    //   if (this.$route.query.from) {
    //     const from = decodeURIComponent(this.$route.query.from)
    //     this.$router.replace({ path: from })
    //     return
    //   }
    //   // location.hash = "#/"
    //   this.$router.replace({ name: "home" })
    // },

    back () {
      this.$emit("close")
    }
  },

  mounted () {
    this.initGoogleLogin()
  },

  beforeDestroy () {

  }
}
</script>

<style lang="scss" scoped>
.sign-drawer {
  position: fixed;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.6);
}
.sign-in {
  // min-height: 100vh;
  width: 310px;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background: #ffffff;
  padding-bottom: 24px;
  .back-btn {
    z-index: 10;
    position: absolute;
    width: 16px;
    height: 16px;
    background: url(https://g.smartcinemausa.com/images/dc9c891a8d114791ad38951435f9c8f7-32-32.png) 0 0 no-repeat;
    background-size: 16px;
    top: 16px;
    right: 16px;
  }

  &_aside {
    position: relative;
    @include flex($jus: center);
    padding:42px 0 18px;
    &_tips {
      text-align: center;
      font-size: 18px;
      @include fontPuhui;
      line-height: 20px;
      color: #121212;
      text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.02);
    }
  }
  &_main {
    // overflow: hidden;
    @include flex(column, center, center);
  }

  .google-login-button {
    width: 250px;
    height: 40px;
    padding-left: 50px;
    border: 1px solid #999999;
    border-radius: 22px;
    @include flex($jus: flex-start);
    background: url(https://g.smartcinemausa.com/images/cf841184588d4678835f412b68d2f72b-32-32.png) left 20px center no-repeat;
    background-size: 24px;
    @include font(15, 21);
    font-weight: 500;
    color: #121212;
    cursor: pointer;
  }
  .facebook-login-button {
    margin-top: 12px;
    width: 250px;
    height: 40px;
    padding-left: 50px;
    border-radius: 22px;
    @include flex($jus: flex-start);
    background: #4267B2 url(https://g.smartcinemausa.com/images/221a1e0423354f73af56f38a04efa871-32-32.png) left 20px center no-repeat;
    background-size: 24px;
    @include font(15, 21);
    font-weight: 500;
    color: #ffffff;
    cursor: pointer;
  }
  .split-line {
    margin-top: 24px;
    margin-bottom: 16px;
    @include flex($jus: center);
    @include font(14, 20);
    color: #999999;
    &::before, &::after {
      content: "";
      margin: 0 10px;
      width: 111px;
      height: 1px;
      background: #ebebeb;
    }
  }
  .tips {
    margin-top: 28px;
    width: 304px;
    transform: scale(0.92);
    @include font(11, 16);
    color: #777777;
    a {
      color: inherit;
      text-decoration: underline;
    }
  }

  &.focus-sc-login {
    // .back-btn {
    //   display: none;
    // }
    .sign-in_main>:not(.sc-login) {
      display: none;
    }
  }

}

@include screen-mobile {
  .sign-drawer{

    .sign-in {
      width: rem(310);
      border-radius: rem(10);
      display: block;
      padding-bottom: rem(24);
      .back-btn {
        position: absolute;
        top: rem(16);
        right: rem(16);
        width: rem(16);
        height: rem(16);

      }

      &_aside {
        width: auto;
        padding: rem(42) 0 rem(18);
        background: none;
        &_tips {
          margin-top: 0;
          @include font-m(18, 20);
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
        width: rem(250);
        height: rem(40);
        padding-left: rem(50);
        background-position: left rem(18) center;
        background-size: rem(24);
        text-indent: rem(10);
        @include font-m(15, 21);
      }
      .facebook-login-button {
        width: rem(250);
        height: rem(40);
        padding-left: rem(50);
        background-position: left rem(18) center;
        background-size: rem(24);
        margin-top: rem(12);
        @include font-m(15, 21);
      }
      .split-line {
        margin-top: rem(24);
        margin-bottom: rem(16);
        @include font-m(14, 20);
        &::before, &::after {
          width: rem(113);
        }
      }
      .tips {
        text-align: justify;
        width: rem(304);
        margin-top: rem(28);
        text-align: center;
        transform: scale(0.92);
        @include font-m(11, 16);
      }
    }
  }

}
</style>
