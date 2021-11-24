import vToolTip from "v-tooltip"
import filters from "./filters"
import directives from "./directives"
import alert from "@/components/Alert/function"
import loading from "@/components/Loading/function"
import confirm from "@/components/Confirm/function"

const install = (Vue, options) => {
  Vue.prototype.$bus = new Vue()
  Vue.prototype.$alert = alert
  Vue.prototype.$loading = loading
  Vue.prototype.$confirm = confirm
  Vue.use(filters)
  Vue.use(directives)
  Vue.use(vToolTip)
}

export default {
  install
}
