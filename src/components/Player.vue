<template>
  <div class="player shaka-player-container" :class="{ paused, ended }" data-shaka-player-container data-shaka-player-cast-receiver-id="7B25EC44">
    <video class="shaka-player-video" ref="video" autoplay @click="() => showControls()" controls controlslist="nodownload nofullscreen noremoteplayback" data-shaka-player></video>
    <div class="player-controls">
      <div class="player-big-play-btn" @click="play"></div>
      <div class="player-ended-mask">
        <slot name="endedMaskContent"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    src: String,
    assetId: String,
    progress: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      loading: true,
      paused: true,
      ended: false
    }
  },

  watch: {
    src: {
      immediate: true,
      handler (v) {
        v && this.onReady(() => this.load())
      }
    }
  },

  methods: {

    showControls (autoHide = true) {
      // const { video } = this
      // console.log("show controls")
      // video.controls = true
      // if (this.controlsTimer) {
      //   clearTimeout(this.controlsTimer)
      // }
      // if (!autoHide) return
      // this.controlsTimer = setTimeout(() => {
      //   console.log("timeout hide video controls")
      //   video.controls = false
      //   this.controlsTimer = null
      // }, 3000)
    },

    setup () {
      const video = this.video = this.$refs.video
      // const ui = video["ui"]
      // ui.configure({
      //   "controlPanelElements": ["time_and_duration"]
      // })
      // const controls = ui.getControls()
      // const player = this.player = controls.getPlayer()
      const player = this.player = new window.shaka.Player(video)

      this.player.configure({
        abr: {
          defaultBandwidthEstimate: 4000000,
          switchInterval: 100,
          Restrictions: {
            minBandwidth: 1000000
          }
        }
      })

      player.addEventListener("error", (error) => {
        console.error("error---------", error.detail.code, error.detail.data[0], error.detail.data[1].message, error.detail.data[2])
      })

      this.video.addEventListener("loadedmetadata", () => {
        if (this.progress >= Math.floor(this.video.duration)) {
          this.ended = true
          this.$emit("ended", this.video)
        }
      })

      this.video.addEventListener("ended", () => {
        this.ended = true
        this.$emit("ended")
      })

      this.video.addEventListener("canplay", () => {
        this.$emit("canplay")
      })

      this.video.addEventListener("play", () => {
        this.paused = false
      })
      this.video.addEventListener("pause", () => {
        this.paused = true
        this.$emit("pause", this.video)
      })

      this.video.addEventListener("timeupdate", () => {
        this.$emit("timeupdate", this.video)
      })

      this.video.addEventListener("canplaythrough", () => {
        this.loading = false
        video.play()
        this.showControls()
        console.log("canplaythrough")
      })

      this.video.addEventListener("waiting", () => {
        this.loading = true
        this.showControls(false)
        console.log("waiting")
      })

      this.ready = true
      this.$emit("ready")
    },

    onReady (success) {
      if (this.ready) {
        success()
      } else {
        this.$on("ready", success)
      }
    },

    load () {
      this.player.configure("drm.servers", { "com.widevine.alpha": `https://api.smartcinemausa.com/drm/getDrmInfo?platform=shaka&uId=1&logRequestId=cdf0283272f4ef1338bd186aac8a93fa&assetId=${this.assetId}` })
      this.player.load(this.src).then(res => {
        if (this.progress) {
          this.video.currentTime = this.progress
        }
        console.log("src loaded")
      }).catch(err => {
        console.log("src load error: ", err)
      })
    },

    play () {
      this.video && this.video.play()
    },

    initUI () {
      var event = document.createEvent("Events")
      event.initEvent("load", true, true)
      window.dispatchEvent(event)
      const setupHanler = () => {
        this.setup()
        document.removeEventListener("shaka-ui-loaded", setupHanler)
      }
      document.addEventListener("shaka-ui-loaded", setupHanler)
    }

  },

  mounted () {
    // this.initUI()
    this.setup()
  },

  beforeDestroy () {
    if (this.controlsTimer) {
      clearTimeout(this.controlsTimer)
    }
    this.$emit("exit", this.video)
  }
}
</script>

<style lang="scss">
.shaka-player {
  &-container {
    width: 100%;
    height: 100%;
  }
  &-video {
    width: 100%;
    height: 100%;
  }
  //全屏按钮

}
.player {
  position: relative;

  @mixin mask() {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.3) center no-repeat;
    background-size: rem(200);
    z-index: 1;
    display: none;
  }
  &-controls {

  }
  &-big-play-btn {
    @include mask;
    background-image: url(https://g.smartcinemausa.com/images/fa038af1d6b84657a7accd621bc5f9ef-400-400.png);
    background-size: rem(200);
  }

  &-ended-mask {
    @include mask;
  }

  &.paused {
    .player-big-play-btn {
      display: block;
    }
    video::-webkit-media-controls-panel {
      display: none !important;
    }
  }

  &.ended {
    .player-big-play-btn {
      display: none;
    }
    .video {
      display: none;
    }
    .player-ended-mask {
      display: block;
    }
  }
}
</style>
