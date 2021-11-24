<template>
  <div class="paypal"></div>
</template>

<script>
import paypalHelper from "@/common/lib/paypal"

export default {
  props: {
    // checkoutData 数据格式为： { skuId: 必需, buyNumber: 必需, couponId: 非必需 }，
    // 支持传入对象，或者返回对象的函数，或者返回一个promise 的函数，promise 必须resolve上述格式数据
    checkoutData: {
      type: [Object, Function],
      default: () => ({})
    },
    onPayApprove: {
      type: Function,
      default () {}
    },
    onPaySuccess: {
      type: Function,
      default () {}
    },
    onBuySuccess: {
      type: Function,
      default () {}
    },
    onError: {
      type: Function,
      default () {}
    },
    onCancel: {
      type: Function,
      default () {}
    },
    buttonOptions: {
      type: Object,
      default: () => ({})
    }
  },

  methods: {

  },

  mounted () {
    paypalHelper.render(this.$el, {
      checkoutData: this.checkoutData,
      onPayApprove: this.onPayApprove,
      onPaySuccess: this.onPaySuccess,
      onBuySuccess: this.onBuySuccess,
      onError: this.onError,
      buttonOptions: this.buttonOptions
    })
  }
}

</script>
