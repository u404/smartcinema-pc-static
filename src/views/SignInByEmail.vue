<template>
  <div class="sign-in-container">
    <div class="step step--enter form" v-form v-if="step === 0" key="step--enter">
      <div class="form_title">{{$i18n._("Enter your email")}}</div>
      <div class="form_item">
        <div class="form_input" :class="{ error: emailInputError }" v-inputFocus>
          <input class="input" type="text" :placeholder="$i18n._('Email address')" v-fixModel="emailInput" ref="emailInput" @input="emailInputError = ''" />
        </div>
        <div class="form_input-error" v-show="emailInputError">{{emailInputError}}</div>
      </div>
      <button class="form_button" :disabled="!emailInput" type="submit" @click="checkEmailAndGoNextStep">{{$i18n._("Continue")}}</button>
      <div class="button link-button toggle-button" @click="$emit('toggle')">{{$i18n._("Switch to mobile")}}</div>
    </div>
    <div class="step step--sign-in form" v-form v-else-if="signType === SignTypes.SignIn" key="step--sign-in">
      <div class="form_item">
        <div class="form_label">{{$i18n._('Email address')}}</div>
        <div class="form_input disabled">
          <input class="input" type="text" disabled :placeholder="$i18n._('Email address')" v-fixModel="emailInput" />
        </div>
      </div>
      <div class="form_item">
        <div class="form_label">{{$i18n._('Password')}}</div>
        <div class="form_input" :class="{ error: passwordInputError }" v-inputFocus>
          <input type="password" v-if="!passwordVisible" ref="passwordInput" :placeholder="$i18n._('Password')" v-autoFocus v-fixModel="passwordInput" @input="passwordInputError = ''">
          <input type="text" v-else :placeholder="$i18n._('Password')" ref="passwordInput" v-autoFocus v-fixModel="passwordInput" @input="passwordInputError = ''">
          <span class="button pwd-toggle-button" :class="{ active: passwordVisible }" @click="() => { passwordVisible = !passwordVisible; $nextTick(() => { $refs.passwordInput.focus() })}"></span>
        </div>
        <div class="form_input-error" v-show="passwordInputError">{{passwordInputError}}</div>
      </div>
      <button class="form_button" :disabled="loginDisabled" type="submit" @click="login">{{$i18n._('Continue')}}</button>
      <div class="button link-button back-button" @click="back">{{$i18n._('Back')}}</div>
    </div>
    <div class="step step--sign-up form" v-form v-else-if="signType === SignTypes.SignUp" key="step--sign-up">
      <div class="form_guide">
        <div class="form_guide_title" v-html="$i18n._('sign-up-tips').replace('{x}', `<b>${emailInput}</b>`)"></div>
        <div class="form_guide_desc">{{$i18n._("send-code-tips")}}</div>
      </div>
      <div class="form_item">
        <div class="form_label">{{$i18n._('Verification code')}}</div>
        <div class="form_input" :class="{ error: emailCodeInputError }" v-inputFocus>
          <input class="input" type="text" ref="emailCodeInput" :placeholder="$i18n._('Verification code')" v-autoFocus v-fixModel="emailCodeInput" @input="emailCodeInputError = ''" />
        </div>
        <div class="form_input-error" v-show="emailCodeInputError">{{emailCodeInputError}}</div>
      </div>
      <div class="form_item">
        <div class="form_label">{{$i18n._('Password')}}</div>
        <div class="form_input" :class="{ error: passwordInputError }" v-inputFocus>
          <input type="password" v-if="!passwordVisible" ref="passwordInput" :placeholder="$i18n._('Password')" v-fixModel="passwordInput" @input="passwordInputError = ''">
          <input type="text" v-else :placeholder="$i18n._('Password')" ref="passwordInput" v-fixModel="passwordInput" @input="passwordInputError = ''">
          <span class="button pwd-toggle-button" :class="{ active: passwordVisible }" @click="() => { passwordVisible = !passwordVisible; $nextTick(() => { $refs.passwordInput.focus() })}"></span>
        </div>
        <div class="form_input-error" v-show="passwordInputError">{{passwordInputError}}</div>
      </div>
      <button class="form_button" :disabled="registDisabled" type="submit" @click="regist">{{$i18n._('Continue')}}</button>
      <div class="button link-button back-button" @click="back">{{$i18n._('Back')}}</div>
    </div>

  </div>
</template>

<script>
import { mapMutations } from "vuex"
import MD5 from "md5.js"
import services from "@/services"
import logger from "@/logger"

const SignTypes = {
  SignIn: 0,
  SignUp: 1
}

export default {
  components: {
  },

  props: {
    code: {
      type: String,
      default: ""
    }
  },

  data () {
    return {
      signType: null,
      SignTypes,

      step: 0,

      emailInput: "",
      emailInputError: "",
      emailCodeInput: "",
      emailCodeInputError: "",
      passwordInput: "",
      passwordInputError: "",
      passwordVisible: false,

      checkEmailButtonDisabled: true

    }
  },

  computed: {
    emailValid () {
      return /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/.test(this.emailInput)
    },

    passwordValid () {
      return this.passwordInput.length >= 6
    },

    loginDisabled () {
      return !this.emailInput || !this.passwordInput
    },

    registDisabled () {
      return !this.emailInput || !this.emailCodeInput || !this.passwordInput
    }
  },

  watch: {
    step: {
      immediate: true,
      handler (value, oldValue) {
        this.$emit("stepChange", { value, oldValue, isSignIn: this.signType === SignTypes.SignIn, isSignUp: this.signType === SignTypes.SignUp })
      }
    }
  },

  methods: {
    ...mapMutations(["setState"]),

    loadPromise (promise) {
      this.$loading()
      return promise.then(res => {
        this.$loading.close()
        return res
      }).catch(err => {
        this.$loading.close()
        throw err || { msg: this.$i18n._("error-network") }
      })
    },

    async sendEmailCode () {
      const res = this.loadPromise(services.user.emailSendCode(this.emailInput))
      return res
    },

    async checkEmailAndGoNextStep () {
      if (!this.emailValid) {
        this.emailInputError = this.$i18n._("error-email-char")
        this.$refs.emailInput.focus()
        return
      }
      this.emailInputError = ""

      try {
        const res = await this.loadPromise(services.user.checkEmailExist(this.emailInput))

        if (res) {
          this.signType = SignTypes.SignIn
        } else {
          await this.sendEmailCode()
          this.signType = SignTypes.SignUp
        }

        this.step++
        logger.log("login_page_email")
      } catch (e) {
        this.emailInputError = e.msg
        this.$refs.emailInput.focus()
      }
    },

    async login () {
      const md5Pwd = new MD5().update(this.passwordInput).digest("hex")

      try {
        const res = await this.loadPromise(services.user.emailLogin(this.emailInput, md5Pwd))
        this.$emit("success", res)
      } catch (e) {
        this.passwordInputError = e.msg
        this.$refs.passwordInput.focus()
      }
    },

    async regist () {
      if (!this.passwordValid) {
        this.passwordInputError = this.$i18n._("error-password-length")
        this.$refs.passwordInput.focus()
        return
      }
      this.emailCodeInputError = ""
      this.passwordInputError = ""
      const md5Pwd = new MD5().update(this.passwordInput).digest("hex")

      try {
        const res = await this.loadPromise(services.user.emailRegist(this.emailInput, this.emailCodeInput, md5Pwd))
        this.$emit("success", res)
      } catch (e) {
        this.emailCodeInputError = e.msg
        this.$refs.emailCodeInput.focus()
      }
    },

    back () {
      this.passwordInputError = ""
      this.emailCodeInputError = ""
      this.signType = null
      this.step = 0
    }

  },

  mounted () {

  },

  beforeDestroy () {

  }
}
</script>

<style lang="scss" scoped>
@import "~@/common/style/sign-in-container.scss";
</style>
