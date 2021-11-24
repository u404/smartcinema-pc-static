import Vue from "vue"

import component from "./main"

const Constructor = Vue.extend(component)

const defaults = {
  msg: "",
  parent: null
}

let instance

Constructor.prototype.close = function () {
  this.show = false
}

const func = (options = {}) => {
  options = { ...defaults, ...options }

  const parent = options.parent || document.body

  if(!instance) {
    instance = new Constructor({
      el: document.createElement("div"),
      data: options
    })

    console.log(instance)

    parent.appendChild(instance.$el)
  } else {
    if(parent !== instance.parent) {
      parent.appendChild(instance.$el)
    }
  }

  instance.msg = options.msg

  Vue.nextTick(() => {
    instance.show = true
  })

  return instance
}

func.close = () => {
  instance && instance.close()
}

export default func