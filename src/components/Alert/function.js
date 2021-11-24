import Vue from "vue"

import component from "./main"

const Constructor = Vue.extend(component)

let instance

const func = (msg, options = {}) => {
  if (typeof msg === "object") {
    options = msg
    msg = options.msg || options.message || ""
  }

  const parent = options.parent || document.body

  if (!instance) {
    instance = new Constructor({
      el: document.createElement("div"),
      data: {
        parent
      }
    })
    parent.appendChild(instance.$el)
  } else {
    if (parent !== instance.parent) {
      parent.appendChild(instance.$el)
    }
  }

  Vue.nextTick(() => {
    instance.show(msg, options)
  })

  return instance
}

func.close = () => {
  instance && instance.close()
}

export default func
