<template>
  <Error v-if="error"></Error>
  <Page v-else>
    <Detail class="page-main" @error="onError" />
  </Page>
</template>

<script>
import Page from "./layouts/Page"
import Detail from "./views/Detail"
import Error from "./views/Error"

import reporter from "@sc/lib-amplitude"

export default {
  components: {
    Error,
    Page,
    Detail
  },
  data () {
    return {
      error: false
    }
  },

  computed: {
  },

  methods: {
    onError (err) {
      this.error = true
      reporter.track("vizio_pay_h5_abnormal", { error_msg: (err && err.msg) || "" })
    }
  },

  beforeMount () {
    reporter.init()
  },

  mounted () {
  }

}
</script>
