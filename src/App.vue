<template>
  <router-view></router-view>
</template>

<script>
import { mapState, mapActions } from "vuex"
import env from "@sc/lib-env"
import logger from "./logger"
import facebookSDK from "@/common/lib/facebook-sdk"
import { SITE_CONFIG } from "./define"
import services from "./services"

export default {
  components: {

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
