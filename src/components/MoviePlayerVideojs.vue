<template>
  <div class="movie-player" :class="{ 'movie-player-fullscreen': isFullScreen }" ref="player">
    <video class="video-js" ref="video"></video>
    <img class="ad-logo" v-show="data.adLogo" :src="data.adLogo" />
    <slot></slot>
  </div>
</template>

<script>
import "video.js/dist/video-js.css"
import videojs from "video.js"
import "videojs-contrib-ads/dist/videojs.ads.css"
import "videojs-contrib-ads"
import "videojs-ima/dist/videojs.ima.css"
import "videojs-ima"

const { google } = window

export default {
  props: {
    data: {
      type: Object,
      defualt: () => ({})
    },
    ad: {
      type: Object,
      defualt: () => ({ enabled: false, url: "" })
    },
    autoplay: {
      type: Boolean,
      defualt: true
    },
    isTrailer: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      setupSuccess: false,
      trailerTipsVisible: false
    }
  },

  watch: {
    data () {
      this.loadMovie()
    },
    ad () {
      this.setupAd()
    },
    autoplay (v) {
      this.player.autoplay(!!v)
    }

  },

  methods: {

    setupEvents () {
      // const listenEventAndEmit = (name, handler) => {
      //   this.player.on(name, (e) => {
      //     handler && handler(e)
      //     this.$emit(name, e)
      //   })
      // }

      this.player.on("loadeddata", () => {
        this.$emit("loaded")
        if (this.isTrailer) {
          this._trailerTips.show()
        } else {
          this._trailerTips.hide()
        }
      })

      // first play
      this.player.one("play", () => {
        this.$emit("firstplay")
      })

      this.player.on("play", (e) => {
        this.$emit("play", this.player)
      })

      this.player.on("pause", () => {
        this.$emit("pause", this.player)
      })

      this.player.on("timeupdate", (e) => {
        this.$emit("timeupdate", this.player)
      })

      this.player.on("error", (e) => {
        this.$emit("error", e)
      })

      // ad event
      this.player.on("ads-ad-started", () => {
        console.log("ads-ad-started")
      })
      this.player.on("ads-manager", (e) => {
        console.log("ads-manager", e)
        const { adsManager } = e
        adsManager.addEventListener(google.ima.AdEvent.Type.LOADED, (adEvent) => {
          const ad = adEvent.getAd()
          this.duration = ad.getDuration()
        })

        adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, (adEvent) => {
          const ad = adEvent.getAd()
          this.$emit("ads-started", ad)
        })

        adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, (adEvent) => {
          this.adTimer = setInterval(() => {
            this.remainingTime = Math.floor(adsManager.getRemainingTime())
            this.$emit("ads-time-update", { remainingTime: this.remainingTime, duration: this.duration })
            if (this.remainingTime <= 0) {
              this.adTimer && clearInterval(this.adTimer)
            }
          },
          300)
        })

        adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, (adEvent) => {
          this.$emit("ads-completed")
        })

        adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (ev) => {
          this.adTimer && clearInterval(this.adTimer)
          // const error = ev.getError()
          // this.$emit("ads-error", { ...error.g, ad: error.getAd() })
          // 统一由下面的adserror监听器处理
        })

        this.$emit("ads-load-success", e)
      })
      // this.player.on("ads-loader", (e) => {
      //   const { adsLoader } = e
      //   adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, (ev) => {
      //     const error = ev.getError()
      //     this.$emit("ads-error", error.g)
      //     // 统一由下面的adserror监听器处理
      //   },
      //   false)
      // })
      this.player.on("ads-request", (e) => {
        this.$emit("ads-load-start", e)
      })
      this.player.on("adserror", (e) => {
        const error = (e.data.adError && e.data.adError.g) || e.data.AdErrorEvent
        this.$emit("ads-error", error)
      })
    },

    setupPlayer () {
      const video = this.video = this.$refs.video

      video.setAttribute("playsinline", true)
      video.setAttribute("webkit-playsinline", true)
      video.setAttribute("x5-playsinline", true)
      video.setAttribute("x5-video-player-type", "h5")
      video.setAttribute("x5-video-player-fullscreen", false)

      const options = {
        autoplay: this.autoplay,
        controls: true,
        controlBar: {
          // fluid: true,
          currentTimeDisplay: true,
          remainingTimeDisplay: false
        },
        techOrder: ["html5"],
        plugins: {}
      }

      this.player = videojs(video, options, () => {
        console.log("onPlayerReady")
        this.setupSuccess = true

        this.$emit("ready")
      })

      this.setupToolkit()

      this.setupEvents()

      this.$on("ready", () => {
        this.loadMovie()
      })

      document.onfullscreenchange = document.onwebkitfullscreenchange = () => {
        if (document.fullscreenElement) { // 进入全屏
          this.isFullScreen = true
        } else {
          this.isFullScreen = false
        }
      }
    },
    playPause () {
      this.player && this.player.pause()
    },

    setupToolkit () {
      const Component = videojs.getComponent("Component")
      const trailerTips = new Component(this.player)
      trailerTips.addClass("movie-player_tips")
      const el = trailerTips.el()
      el.innerHTML = this.$i18n._("Trailer")
      this.player.addChild(trailerTips)
      trailerTips.hide()
      this._trailerTips = trailerTips
    },

    setupAd () {
      if (this.adInited) return
      if (this.ad.enabled) {
        this.player.ima({
          adLabel: this.$i18n._("AD"),
          adLabelNofN: this.$i18n._("AD_of"),
          adTagUrl: this.ad.url,
          adsRenderingSettings: {
            enablePreloading: true
          }
        })
        this.adInited = true
      } else {

      }
    },

    async loadMovie () {
      if (!this.setupSuccess) return
      const { src, poster } = this.data
      poster && this.player.poster(poster)
      src && this.player.src({ src })
    },

    play () {
      setTimeout(() => {
        this.player && this.player.play()
      }, 0)
    }
  },

  mounted () {
    this.setupPlayer()
    this.setupAd()
  },
  beforeDestroy () {
    this.player.pause()
    this.player.dispose()
    this.adTimer && clearInterval(this.adTimer)
  }
}
</script>

<style lang="scss">
@keyframes flyInOut {
  0% {
    transform: translateX(calc(-100% - 40px));
  }
  10% {
    transform: translateX(calc(-100% - 40px));
  }
  13% {
    transform: translateX(0);
  }
  75% {
    opacity: 1;
  }
  85% {
    opacity: 0;
  }
  100% {
    opacity: 0;
    display: none;
  }
}

.movie-player {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .video-js {
    width: 100%;
    height: 100%;
    font-size: 18px;

    .vjs-control {
      outline: none;
      -webkit-tap-highlight-color: transparent;
    }

    .vjs-control-bar {
      // background-color: rgba(43, 51, 63, 0.3);
      background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%);
      z-index: 1;
      .vjs-time-control{
        display: block;
        min-width: 0;
        padding: 0;
      }
      .vjs-time-divider {
        padding-left: 0.5em;
        padding-right: 0.5em;
      }
      .vjs-volume-panel {
        display: none;
      }
      .vjs-progress-control {
        padding-left: 1em;
      }
      .vjs-picture-in-picture-control {
        display: none;
      }
      .vjs-subs-caps-button {
        display: none;
      }
    }

    .vjs-big-play-button{
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 118px;
      height: 118px;
      background: url(https://g.smartcinemausa.com/images/acf5d3b316ab4ae3abc4fcafaee782e9-340-340.png) 0 0 no-repeat;
      background-size: contain;
      border: none;
      &::after{
        content: "";
        display: none !important;
      }
      .vjs-icon-placeholder{
        display: none;
      }
    }

    .vjs-poster {
      background-size: cover;
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

    // 广告相关样式
    .ima-ad-container {
      .ima-controls-div {
        height: 100%;
        background: none;
        pointer-events: none;
        &:before {
          content: "";
          position: absolute;
          bottom: 0;
          width: 100%;
          height: 3.7em;
          background: linear-gradient(to top, rgba(7, 20, 30, .7) 0%, rgba(7, 20, 30, 0) 100%);
          opacity: 0;
          transition: opacity ease 0.3s;
        }

        .ima-countdown-div {
          position: absolute;
          top: 1em;
          right: 1em;
          padding: 0.5em 0.8em;
          height: auto;
          background: rgba(7, 20, 30, .7);
          border-radius: 2em;
          font-size: 14px;
        }

        .ima-play-pause-div, .ima-fullscreen-div {
          pointer-events: auto;
          top: auto;
          bottom: 0.5em;
          opacity: 0;
          transition: opacity ease 0.3s;
        }

        .ima-seek-bar-div, .ima-mute-div, .ima-slider-div {
          display: none;
        }

        &-showing {
          &:before {
            opacity: 1;
          }
          .ima-play-pause-div, .ima-fullscreen-div {
            opacity: 1;
          }
        }

      }
    }
  }

  &_tips {
    position: absolute;
    top: 35px;
    left: 40px;
    padding-bottom: 4px;
    border-bottom: 2px solid #FFC338;
    @include font(24, 33);
    color: #ffffff;
    animation: flyInOut 10s ease-in forwards;
  }

}

@include screen-mobile {
  .movie-player {
    .video-js {
      font-size: rem(14);

      .vjs-big-play-button {
        width: rem(80);
        height: rem(80);
      }
    }
    &_tips {
      top: rem(10);
      left: rem(12);
      padding-bottom: rem(1);
      border-bottom: 2px solid #FFC338;
      @include font-m(14, 20);
    }
    .ad-logo {
      top: rem(15);
      left: rem(15);
      width: rem(31);
    }
  }
}

</style>
