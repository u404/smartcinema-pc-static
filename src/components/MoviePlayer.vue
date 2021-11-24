<template>
  <div class="movie-player shaka-player-container" :class="{ ended, 'movie-player-fullscreen': isFullScreen }" ref="player">
    <video class="shaka-player-video" ref="video" autoplay></video>
    <img class="ad-logo" v-show="data.adLogo" :src="data.adLogo" />
  </div>
</template>

<script>
import "shaka-player/dist/controls.css"
import shaka from "shaka-player/dist/shaka-player.ui"

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

    async setupPlayer () {
      const video = this.video = this.$refs.video

      const player = this.player = new shaka.Player(video)
      const ui = this.ui = new shaka.ui.Overlay(player, this.$refs.player, video)
      ui.configure({
        doubleClickForFullscreen: true, // 默认true
        enableFullscreenOnRotation: true, // 默认true
        forceLandscapeOnFullscreen: false, // 默认true
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

    async loadMovie () {
      this.video.poster = this.data.poster
      let src = this.data.src
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

    .ad-logo {
      position: absolute;
      top: 24px;
      left: 24px;
      width: 92px;
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

@include screen-mobile {
  .shaka-player {
    &-container {
      .ad-logo {
        top: rem(15);
        left: rem(15);
        width: rem(31);
      }
    }
  }
}

</style>
