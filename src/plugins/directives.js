import imageDirective from "@sc/vue-ui-h5/lib/directives/image"
import avatorDirective from "@sc/vue-ui-h5/lib/directives/avator"
import lazyload from "@sc/vue-ui-h5/lib/directives/lazyload"

const form = {
  inserted: (el, binding) => {
    el.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        const inputs = el.querySelectorAll("input")
        const index = [].indexOf.call(inputs, e.target)
        const nextInput = inputs[index + 1]
        if (nextInput) {
          nextInput.focus()
        } else {
          el.querySelector("[type=submit]").click()
        }
      }
    })
  }
}

const fixModel = {
  bind (el, binding, vnode) {
    el.value = binding.value
    el.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\s+/g, "")
      vnode.context[binding.expression] = e.target.value
    })
  },

  update (el, binding) {
    el.value = binding.value
  }
}

const fixNumberModel = {
  bind (el, binding, vnode) {
    el.value = binding.value
    el.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/\D+/g, "")
      vnode.context[binding.expression] = e.target.value
    })
  },

  update (el, binding) {
    el.value = binding.value
  }
}

const autoFocus = {
  inserted: function (el) {
    el.focus()
  }
}

const inputFocus = {
  bind (el, binding, vnode) {
    el.value = binding.value
    const inputs = el.querySelectorAll("input")
    inputs.forEach(input => {
      input.addEventListener("focus", (e) => {
        el.classList.add("focus")
      })
      input.addEventListener("blur", (e) => {
        el.classList.remove("focus")
      })
    })
  }
}

export default {
  install (Vue, options) {
    Vue.directive("image", imageDirective)
    Vue.directive("avator", avatorDirective)
    Vue.directive("lazyload", lazyload)
    Vue.directive("form", form)
    Vue.directive("fixModel", fixModel)
    Vue.directive("fixNumberModel", fixNumberModel)
    Vue.directive("inputFocus", inputFocus)
    Vue.directive("autoFocus", autoFocus)
  }
}
