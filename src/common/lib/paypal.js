import env from "@sc/lib-env"
import axios from "@sc/lib-axios"
import qs from "qs"
import url from "url"

const queryData = url.parse(location.href, true).query
let ticketChannel = queryData.channel

const defaultSDKParams = {
  "client-id": ["prod", "pre"].indexOf(env.env) > -1 ? "ASUWBOaUVmuTpUmYmK-jyf9vgIo8FkXtFeanFHgErpoFypCk2XwHFfXFPozJb07sMvVahn7aaPax9wsL" : "AbvZ7Y-3N4qTqto9SVebspeYFTLeuphlwg_BydioIng1_i5Ju8GsfV6yrB2SvkGx80kFCOBvWWSuOPIo",
  "components": "buttons,funding-eligibility"
}

const axiosOptions = () => ({
  headers: {
    // platformType: 1,
    // "X-Region-Id": 1,
    // "X-Lang": "en_US",
    // "X-Llat": "36.3151",
    // "X-Llng": "-93.6914"
  }
})

let initing = false
let inited = false

const eventEmitter = {
  events: {},
  on (type, handler) {
    if (!this.events[type]) {
      this.events[type] = []
    }
    this.events[type].push(handler)
  },
  off (type, handler) {
    if (!this.events[type]) return
    if (handler) {
      const index = this.events[type].indexOf(handler)
      if (index > -1) {
        this.events[type].splice(index, 1)
      }
    } else {
      this.events[type] = []
    }
  },
  emit (type, data) {
    if (!this.events[type]) return
    this.events[type].forEach(handler => {
      handler.call(this, data)
    })
  }
}

const init = (params = {}) => {
  if (inited || initing) return
  initing = true
  const src = `https://www.paypal.com/sdk/js?${qs.stringify({ ...defaultSDKParams, ...params })}`
  const script = document.createElement("script")
  script.onload = () => {
    inited = true
    eventEmitter.emit("inited")
  }
  script.src = src
  document.head.appendChild(script)
}

const onInited = (handler) => {
  if (!inited) {
    eventEmitter.on("inited", () => handler(window.paypal))
  } else {
    handler(window.paypal)
  }
}

const verifyPayment = async (paymentId, orderNo, ticketChannel = "") => {
  await new Promise(resolve => {
    setTimeout(() => resolve(), 1000)
  })
  try {
    const res = await axios.post("/ticket/pay/paypalpay/verifyPayment", { orderNo, paymentId, ticketChannel }, axiosOptions())
    return res
  } catch (e) {
    const res = await verifyPayment(paymentId, orderNo, ticketChannel)
    return res
  }
}

const createButtons = ({
  // checkoutData 数据格式为： { skuId: 必需, buyNumber: 必需, couponId: 非必需 }，支持传入对象，或者返回对象的函数，或者返回一个promise 的函数，promise 必须resolve该格式数据
  checkoutData = {},
  onPayApprove = () => {},
  onPaySuccess = () => {},
  onBuySuccess = () => {},
  onError = () => {},
  onCancel = () => {},
  buttonOptions = {}
}) => {
  return window.paypal.Buttons({
    createOrder: async (data, actions) => {
      let params = checkoutData
      if (toString.call(checkoutData) === "[object Function]") {
        params = checkoutData()
        if (params instanceof Promise) {
          params = await params
        }
      }

      if (!params || !params.skuId) {
        throw new Error("sku not exist")
      }

      try {
        const scOrder = await axios.post("/ticket/order/outside/flowAdd", params, axiosOptions())

        const paymentInfo = await axios.get("/ticket/pay/paypalpay/getPayPalPayment", {
          orderId: scOrder.id,
          payPlatform: env.os.isMobile ? 10 : 5
        }, axiosOptions())

        const result = await actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: paymentInfo.currencyType, // "USD"
              value: String(paymentInfo.orderFee) // scOrder.payment
            },
            description: paymentInfo.spuName, // scOrder.spuName, // 出现在paypal收银台的商品描述
            custom_id: paymentInfo.orderNo // scOrder.orderNumber
          }],
          application_context: {
            // brand_name: "Smartcinema USA",
            payment_method: {
              user_action: "PAY_NOW"
            }
          }
        })
        return result
      } catch (e) {
        onError(e)
        return Promise.reject(e)
      }
    },
    onApprove: async (data, actions) => {
      onPayApprove(data)
      const details = await actions.order.capture()
      onPaySuccess({ id: details.id, orderId: details.purchase_units[0].custom_id }, details)
      const res = await verifyPayment(details.id, details.purchase_units[0].custom_id, ticketChannel)
      onBuySuccess(res, details)
      return res
    },
    onCancel,
    ...buttonOptions
  })
}

const render = (container, options) => {
  onInited(() => {
    createButtons(options).render(container)
  })
}

init()

export default {
  onInited,
  render,
  createButtons
}
