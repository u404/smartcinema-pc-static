<template>
  <Page>
    <Home></Home>
  </Page>
</template>

<script>
import { mapState, mapActions } from "vuex"
import env from "@sc/lib-env"
import logger from "@/logger"
import facebookSDK from "@/common/lib/facebook-sdk"
import { SITE_CONFIG } from "@/define"
import services from "@/services"

import Page from "@/layouts/Page"
import Home from "@/views/Home"

window.staticPageConfig = {
  evalScript: `Array.from(document.head.querySelectorAll('script')).forEach(s => s.id !== 'rem' && s.remove());`
}

export default {
  components: {
    Page,
    Home
  },
  data () {
    return {
    }
  },

  computed: {
    ...mapState(["queryData"])
  },

  methods: {
    ...mapActions(["getUserByLocalToken"])
  },

  beforeMount () {
    this.getUserByLocalToken()
    services.user.setBaseParams({ uChannel: this.queryData.channel })
    logger.setBaseData({
      region: env.browser.overseas,
      client_type: env.os.isMobile ? "mobile" : "PC",
      channel: this.queryData.channel
    })
  },

  mounted () {
    facebookSDK.init(SITE_CONFIG.facebookAppId)
  }

}
</script>

<style lang="scss">
</style>
