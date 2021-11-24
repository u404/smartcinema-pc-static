<template>
  <div class="movie-player" :class="{ 'movie-player-fullscreen': isFullScreen }" ref="player">
    <video class="video-js" ref="video" autoplay></video>
  </div>
</template>

<script>
import "video.js/dist/video-js.css"
import videojs from "video.js"

export default {
  props: {
    src: String,
    poster: String
  },

  data () {
    return {
      isFullScreen: false
    }
  },

  watch: {
    src () {
      this.loadMovie()
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

      // first play
      this.player.one("play", () => {
        this.$emit("firstplay")
      })

      this.player.on("error", (e) => {
        this.$emit("error", e)
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
        autoplay: true,
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
        this.playerReady = true

        this.$emit("ready")
      })
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

    loadMovie () {
      if (!this.playerReady) return
      this.player.poster(this.poster)
      this.player.src({ src: this.src })
    }
  },

  mounted () {
    this.setupPlayer()
  }
}
</script>

<style lang="scss">
@import "../styles/mixins.scss";

.movie-player {
  width: 100%;
  height: 100%;

  .video-js {
    width: 100%;
    height: 100%;
    font-size: 14px;

    .vjs-control-bar {
      // background-color: rgba(43, 51, 63, 0.3);
      background: transparent;
      z-index: 1;
      .vjs-time-control{
        display:block;
      }
    }

    .vjs-big-play-button{
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      width: 118px;
      height: 118px;
      background: url(https://g.smartcinemausa.com/images/b7628966b4564825a0b780b5cdc0b4ce-118-118.png) 0 0 no-repeat;
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
    .vjs-poster{
      background-size: cover;
    }

  }

}

@media screen and (max-width: 767px) {
  .movie-player {

    .video-js {
      font-size: rem(10);

      .vjs-big-play-button {
        width: rem(59);
        height: rem(59);
      }
    }
  }
}

</style>
