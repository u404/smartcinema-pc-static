<template>
  <div class="sign-in-container">
    <div class="step step--enter form" v-form v-if="step === 0" key="step--enter">
      <div class="form_title">{{$i18n._('Enter your mobile')}}</div>
      <div class="form_item">
        <div class="form_input" :class="{ error: mobileInputError }" v-inputFocus>
          <div class="selector" :class="{ 'text-style': AreaSelectorTextStyle, active: areaSeletorActive }" @click="areaSeletorActive = false">
            <div class="selector-input" @click.stop="areaSeletorActive = true">
              <img class="icon" :src="area.icon" alt="">
              <span class="title">{{$i18n._(area.name)}}</span>
              <span class="code">+{{area.code}}</span>
            </div>
            <div class="selector-mask" v-show="areaSeletorActive"></div>
            <transition name="dropdownToggle">
              <ul class="selector-options" v-show="areaSeletorActive">
                <li class="selector-option" :class="{ active: area === item }" v-for="(item, i) in AreaList" :key="i" @click="area = item; mobileInput = ''">
                  <img class="icon" :src="item.icon" alt="">
                  <span class="title">{{$i18n._(item.name)}}</span>
                  <span class="code">+{{item.code}}</span>
                </li>
              </ul>
            </transition>
          </div>
          <input type="tel" pattern="[0-9]*" :maxlength="area.mobileLength" :placeholder="$i18n._('Mobile number')" v-fixNumberModel="mobileInput" ref="mobileInput" @input="mobileInputError = ''">
        </div>
        <div class="form_input-error" v-show="mobileInputError">{{mobileInputError}}</div>
      </div>
      <button class="form_button" :disabled="smsButtonDisabled" type="submit" @click="sendSmsAndGoNextStep">{{ smsCodeCountdown > 0 ? `${smsCodeCountdown}s` : $i18n._('Send Code') }}</button>
      <div class="button link-button toggle-button" @click="$emit('toggle')">{{$i18n._('Switch to email')}}</div>
    </div>
    <div class="step step--sign-in form" v-form v-else key="step--sign-in">
      <div class="form_item">
        <div class="form_label">{{$i18n._('Mobile')}}</div>
        <div class="form_input disabled">
          <div class="selector disabled" :class="{ 'text-style': AreaSelectorTextStyle }">
            <div class="selector-input">
              <img class="icon" :src="area.icon" alt="">
              <span class="title">{{$i18n._(area.name)}}</span>
              <span class="code">+{{area.code}}</span>
            </div>
          </div>
          <input type="tel" pattern="[0-9]*" disabled :maxlength="area.mobileLength" :placeholder="$i18n._('Mobile number')" v-fixNumberModel="mobileInput">
        </div>
      </div>
      <div class="form_item">
        <div class="form_label">{{$i18n._('Verifcation Code')}}</div>
        <div class="form_input" :class="{ error: smsCodeInputError }" v-inputFocus>
          <input type="text" :placeholder="$i18n._('Verifcation Code')" maxlength="8" v-autoFocus v-fixModel="smsCodeInput" ref="smsCodeInput" @input="smsCodeInputError = ''">
          <span class="button link-button vcode-button" :class="{ disabled: smsButtonDisabled }" @click="sendSmsCode">{{ smsCodeCountdown > 0 ? `${smsCodeCountdown}s` : $i18n._('Resend') }}</span>
        </div>
        <div class="form_input-error" v-show="smsCodeInputError">{{smsCodeInputError}}</div>
      </div>
      <button class="form_button" :disabled="submitDisabled" type="submit" @click="login">{{$i18n._('Continue')}}</button>
      <div class="button link-button back-button" @click="back">{{$i18n._('Back')}}</div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex"
import services from "@/services"
import logger from "@/logger"
import { SITE_CONFIG } from "@/define"

const { AreaList, AreaSelectorTextStyle } = SITE_CONFIG

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

      step: 0,

      area: AreaList[0],
      AreaList,
      AreaSelectorTextStyle,

      areaSeletorActive: false,

      mobileInput: "",
      mobileInputError: "",
      smsCodeInput: "",
      smsCodeInputError: "",
      smsCodeCountdown: 0,

      errorTips: ""

    }
  },

  computed: {
    mobileValid () {
      return this.mobileInput.length === this.area.mobileLength
    },

    smsButtonDisabled () {
      return !this.mobileInput || this.smsCodeCountdown > 0
    },
    submitDisabled () {
      return !this.mobileInput || !this.smsCodeInput
    }
  },

  watch: {
    step: {
      immediate: true,
      handler (value, oldValue) {
        this.$emit("stepChange", { value, oldValue })
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

    async sendSmsCode () {
      if (this.smsButtonDisabled) return

      await this.loadPromise(services.user.mobileSendCode(this.mobileInput, this.area.code))
      this.smsCodeCountdown = 60
      this._smsCodeTimer && clearInterval(this._smsCodeTimer)
      this._smsCodeTimer = setInterval(() => {
        this.smsCodeCountdown--
        if (this.smsCodeCountdown <= 0) {
          this._smsCodeTimer && clearInterval(this._smsCodeTimer)
        }
      }, 1000)
    },

    async sendSmsAndGoNextStep () {
      if (!this.mobileValid) {
        this.mobileInputError = this.$i18n._("error-mobile-length")
        this.$refs.mobileInput.focus()
        return
      }
      this.mobileInputError = ""
      try {
        await this.sendSmsCode()
        this.step++
        logger.log("login_page_mobile")
      } catch (e) {
        this.mobileInputError = e.msg
        this.$refs.mobileInput.focus()
      }
    },

    async login () {
      const { mobileInput, smsCodeInput, area } = this
      try {
        const res = await this.loadPromise(services.user.mobileLogin(mobileInput, smsCodeInput, area.code))
        this.$emit("success", res)
      } catch (e) {
        this.smsCodeInputError = e.code === -1 ? this.$i18n._("error-verifcation-code") : e.msg
        this.$refs.smsCodeInput.focus()
      }
    },

    back () {
      // this._smsCodeTimer && clearInterval(this._smsCodeTimer)
      // this.smsCodeCountdown = 0
      this.step = 0
    }

  },

  mounted () {

  },

  beforeDestroy () {
    this._smsCodeTimer && clearInterval(this._smsCodeTimer)
    this._smsCodeTimer = undefined
    this.smsCodeCountdown = 0
  }
}
</script>

<style lang="scss" scoped>
@import "~@/common/style/sign-in-container.scss";
</style>
