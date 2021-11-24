<template>
  <div class="movie-player shaka-player-container" :class="{ ended, 'movie-player-fullscreen': isFullScreen }" ref="player">
    <video class="shaka-player-video" ref="video" autoplay></video>
  </div>
</template>

<script>
import "shaka-player/dist/controls.css"
import shaka from "shaka-player/dist/shaka-player.ui"

import axios from "@sc/lib-axios"

const checkDrmSupport = (() => {
  let drmSupport = null
  return async () => {
    if (drmSupport) return drmSupport
    const support = await shaka.Player.probeSupport()
    console.log("probeSupport", support)
    drmSupport = {
      fps: !!support.drm["com.apple.fps.1_0"],
      widevine: !!support.drm["com.widevine.alpha"]
    }
    return drmSupport
  }
})()

const getCert = (() => {
  let cert = null
  return async () => {
    if (cert) return cert
    const req = await fetch(`${axios.baseURL || ""}/play/getFairPlayCer`)
    cert = await req.arrayBuffer()
    return cert
  }
})()

checkDrmSupport()

export default {
  props: {
    data: {
      type: Object,
      defualt: () => ({})
    }
  },

  data () {
    return {
      setupSuccess: false
    }
  },

  watch: {
    data () {
      this.loadMovie()
    }
  },

  methods: {
    setupPlayerEvents () {
      this.video.addEventListener("loadedmetadata", () => {
        this.enableCCStateListener(true)
        if (this.progress >= Math.floor(this.video.duration)) {
          this.setEnded()
        }
      })

      this.video.addEventListener("ended", () => {
        this.setEnded()
      })

      this.video.addEventListener("canplay", () => {
        console.log("canplay")
        if (!this.videoReady) {
          this.videoReady = true
        }
        this.$emit("canplay")
      })

      this.video.addEventListener("play", () => {
        this.clearControlsTimer()
      })
      this.video.addEventListener("pause", () => {
        this.$emit("pause", this.video)
        this.clearControlsTimer()
      })

      this.video.addEventListener("timeupdate", () => {
        this.$emit("timeupdate", this.video)
      })

      this.video.addEventListener("seeking", (e) => {
        console.log("seeking")
        this.showControls()
        this.enableSeekingFixTimer(true)
      })

      this.video.addEventListener("seeked", () => {
        console.log("seeked")
        this.enableSeekingFixTimer(false)
      })

      this.video.addEventListener("canplaythrough", () => {
        if (this.visible) {
          this.video.play()
        }
        console.log("canplaythrough")
      })

      this.player.addEventListener("error", (error) => {
        this.$emit("error", error)
        console.error("Error code", (error.detail && error.detail.code) || error.code, "object", error)
      })
    },

    setupFirplaySupport () {
      const { player } = this
      player.getNetworkingEngine().registerRequestFilter((type, request) => {
        if (type !== shaka.net.NetworkingEngine.RequestType.LICENSE) {
          return
        }

        const originalPayload = new Uint8Array(request.body)
        const base64Payload = shaka.util.Uint8ArrayUtils.toStandardBase64(originalPayload)
        const params = `spc=${base64Payload}&kdmId=${this.data.fpsKey}`
        request.headers["Content-Type"] = "application/x-www-form-urlencoded"
        request.body = shaka.util.StringUtils.toUTF8(encodeURIComponent(params))
      })

      player.getNetworkingEngine().registerResponseFilter((type, response) => {
        if (type !== shaka.net.NetworkingEngine.RequestType.LICENSE) {
          return
        }

        let responseText = shaka.util.StringUtils.fromUTF8(response.data)
        // Trim whitespace.
        responseText = responseText.trim()

        // Look for <ckc> wrapper and remove it.
        if (responseText.substr(0, 5) === "<ckc>" && responseText.substr(-6) === "</ckc>") {
          responseText = responseText.slice(5, -6)
        }

        // Decode the base64-encoded data into the format the browser expects.
        response.data = shaka.util.Uint8ArrayUtils.fromBase64(responseText).buffer
      })
    },

    async setupPlayer () {
      const video = this.video = this.$refs.video

      const player = this.player = new shaka.Player(video)
      const ui = this.ui = new shaka.ui.Overlay(player, this.$refs.player, video)
      ui.configure({
        addBigPlayButton: true,
        "controlPanelElements": ["time_and_duration", "fullscreen"]
      })
      // this.player.configure({
      //   abr: {
      //     defaultBandwidthEstimate: 4000000,
      //     switchInterval: 10000,
      //     restrictions: {
      //       minBandwidth: 1000000
      //     }
      //   },
      //   streaming: {
      //     alwaysStreamText: true
      //   }
      // })

      // this.setupPlayerEvents()

      const drmSupport = await checkDrmSupport()

      if (drmSupport.fps) {
        this.setupFirplaySupport()
      }

      this.player.addEventListener("error", (error) => {
        this.$emit("error", error)
        console.error("Error code", (error.detail && error.detail.code) || error.code, "object", error)
      })

      document.onfullscreenchange = document.onwebkitfullscreenchange = () => {
        if (document.fullscreenElement) { // 进入全屏
          this.isFullScreen = true
        } else {
          this.isFullScreen = false
        }
      }

      this.setupSuccess = true
    },

    preload () {

    },

    async loadMovie () {
      if (!this.setupSuccess) return

      this.video.poster = this.data.poster

      let src = this.data.src

      const drmSupport = await checkDrmSupport()

      if (drmSupport.fps) {
        const cert = await getCert()
        this.player.configure("drm.advanced.com\\.apple\\.fps\\.1_0.serverCertificate", new Uint8Array(cert))
        this.player.configure("drm.servers", { "com.apple.fps.1_0": `${axios.baseURL || ""}/play/getKsmInfo` })
        src = this.data.m3u8
      } else if (drmSupport.widevine) {
        console.log("drmSupport widevine")
        this.player.configure("drm.servers", { "com.widevine.alpha": `${axios.baseURL || ""}/drm/getDrmInfo?platform=shaka&uId=1&logRequestId=cdf0283272f4ef1338bd186aac8a93fa&assetId=${this.data.assetId}` })
        src = this.data.mpd
      } else {
        // 提示不支持当前浏览器
      }

      src && this.player.load(src, 0).then(res => {
        console.log("src loaded")
      }).catch(err => {
        console.log("src load error: ", err)
      })
    }
  },

  async mounted () {
    await this.setupPlayer()
    await this.loadMovie()
  },

  beforeDestroy () {
    this.setupSuccess = false
  }
}
</script>

<style lang="scss">
.movie-player {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.shaka-player {
  &-container {
    .shaka-text-container {
      z-index: 1;
    }

    .shaka-text-container * {
      padding-bottom: 30px;
      @include font(18, 24);
      background: none;
      text-shadow: 10px 4px 12px #000;
    }

    .shaka-play-button {
      padding: 6%;
      border-radius: 0;
      background-color: transparent;
      background-size: contain;
      box-shadow: none;

      &[icon=play] {
        background-image: url(https://g.smartcinemausa.com/images/acf5d3b316ab4ae3abc4fcafaee782e9-340-340.png);
      }
      &[icon=pause] {
        background-image: url(https://g.smartcinemausa.com/images/0160d3f4bda844b391a8a68cbd9015ea-340-340.png);
      }
    }
  }
  &-video {
    width: 100%;
    height: 100%;
    display: block;
    background: #000;
    object-fit: contain;
  }
}

</style>
