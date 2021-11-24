<template>
  <div class="detail" :class="{ loading }">
    <div class="detail-main">
      <div class="movie-player shaka-player-container" :class="{ ended, 'movie-player-fullscreen': isFullScreen }" ref="player">
        <video class="shaka-player-video" ref="video" autoplay></video>
      </div>
      <div class="film-infos">
        <div class="film-name">{{film.filmName}}</div>
        <div class="film-labels">{{film.filmDesc}}</div>
        <div class="film-desc">{{film.introduction}}</div>
      </div>
    </div>
    <div class="film-infos--mobile">
      <div class="row-box">
        <div class="film-cover" v-image="film.filmImgPath"></div>
        <div class="col-box">
          <div class="top-box">
            <div class="film-name">{{film.filmName}}</div>
            <div class="film-scores-points">
              <div class="film-points">{{film.filmScore && film.filmScore.toFixed(1) || '5.0'}}</div>
              <ProgressStars :points="film.filmScore || 5" />
            </div>
          </div>
          <div class="film-labels">{{film.filmDesc}}</div>
        </div>
      </div>
      <div class="film-desc">
        <div class="part-title">Synopsis</div>
        {{film.introduction}}
      </div>
    </div>
    <div class="detail-bottom">
      <a href="https://smartcinemausa.com" class="btn home-btn">HOME</a>
      <div class="film-stars-points">
        <div class="total-box">
          <div class="film-points">{{film.filmScore && film.filmScore.toFixed(1) || '5.0'}}</div>
          <ProgressStars :points="film.filmScore || 5" />
        </div>
        <ul class="star-rate-list">
          <li class="star-rate" v-for="i in 5" :key="i">
            <ul class="star-list">
              <li class="star-item" v-for="j in 6 - i" :key="j"></li>
            </ul>
            <div class="rate-progress">
              <span class="progress-bar" :style="{ width: `${(film.scoreScaleList && film.scoreScaleList[i - 1] * 100 || 0)}%` }"></span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { queryString } from "@sc/lib-web-utils-intl"

import "shaka-player/dist/controls.css"
import shaka from "shaka-player/dist/shaka-player.ui"

import ProgressStars from "@/components/ProgressStars"

import { setShareMetas } from "@/common/lib/meta"

const queryData = queryString.parse(location.search)

export default {
  components: {
    ProgressStars
  },
  data () {
    return {
      loading: false,
      film: window.__freeMovies__.find(o => String(o.id) === queryData.id),
      paySuccess: false,
      isFullScreen: false
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

    setupPlayer () {
      const video = this.video = this.$refs.video

      video.setAttribute("playsinline", true)
      video.setAttribute("webkit-playsinline", true)
      video.setAttribute("x5-playsinline", true)
      video.setAttribute("x5-video-player-type", "h5")
      video.setAttribute("x5-video-player-fullscreen", false)

      const player = this.player = new shaka.Player(video)
      const ui = this.ui = new shaka.ui.Overlay(player, this.$refs.player, video)
      ui.configure({
        addBigPlayButton: true
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
    },

    loadMovie () {
      this.video.poster = this.film.filmPoster
      // this.video.src = this.film.filmSource
      this.player.load(this.film.filmSource, 0).then(res => {
        console.log("src loaded")
      }).catch(err => {
        console.log("src load error: ", err)
        this.$emit("loadFail", err)
      })
    }
  },

  beforeMount () {
    setShareMetas({
      title: this.film.filmName,
      description: this.film.introduction,
      image: this.film.filmImgPath
    })
  },
  mounted () {
    this.setupPlayer()
    this.loadMovie()
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/mixins.scss";
.detail {
  &-main {
    padding: 15px 0;
    overflow: hidden;
  }

  .movie-player {
    float: right;
    width: 1024px;
    height: 576px;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      top: -10px;
      left: -2px;
      bottom: -10px;
      width: 110px;
      background-image: linear-gradient(-90deg, rgba(18, 18, 18, 0) 0, rgba(18, 18, 18, 1) 99%);
      background-size: 100%;
      z-index: 1;
    }

    &-fullscreen:before {
      display: none;
    }
  }

  /deep/ .shaka-player {
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
        padding: 5%;
      }
    }
    &-video {
      width: 100%;
      height: 100%;
      display: block;
    }
  }

  .film-infos {
    float: left;
    width: 550px;
    position: relative;

    .film-name {
      flex: 0 0 auto;
      @include font(36, 48);
      font-weight: bold;
      color: #FDCB5D;
      @include text-overflow;
    }
    .film-labels {
      flex: 0 0 auto;
      margin-top: 36px;
      @include font(20, 36);
      color: $color-lighter;
      @include text-line-clamp(2);
    }
    .film-desc {
      flex: 0 0 auto;
      margin-top: 20px;
      @include font(16, 36);
      color: $color-normal;
      @include text-line-clamp(10);
      max-height: 360px;
    }
  }

  .film-infos--mobile {
    display: none;
  }

  &-bottom {
    margin-top: 50px;
    @include flex($jus: space-between);
  }

  .home-btn {
    width: 200px;
    height: 52px;
    border-radius: 36px;
    border: 1px solid #ffffff;
    @include font(22, 40);
    color: $color-lightest;
    font-weight: 400;
  }

  .film-stars-points {
    width: 720px;
    @include flex($jus: space-between, $ali: flex-start);
    .total-box {
      flex: 0 0 auto;
      .film-points {
        text-align: center;
        @include font(80, 76);
        color: $color-lightest;
        font-weight: bold;
        margin-bottom: 17px;
      }
    }
    .star-rate-list {
      .star-rate {
        margin-bottom: 10px;
        @include flex($jus: flex-end, $ali: center);
        .star-list {
          @include flex($jus: flex-end);
          .star-item {
            margin-left: 8px;
            width: 15px;
            height: 15px;
            background: url(https://g.smartcinemausa.com/images/8860ece107bc407f931ee706c07a9648-54-52.png) center no-repeat;
            background-size: contain;
            filter: saturate(0);

            &:first-child {
              margin-left: 0;
            }
          }
        }

        .rate-progress {
          margin-left: 10px;
          width: 320px;
          height: 6px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.38);
          .progress-bar {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 6px;
            background: $color-lightest;
          }
        }
      }
    }
  }

  &.loading {
    .film-infos {
      .film-name:before {
        content: "";
        display: inline-block;
        width: 200px;
        height: 24px;
        background: $color-text-loading;
      }
      .film-labels:before {
        content: "";
        display: inline-block;
        width: 400px;
        height: 14px;
        background: $color-text-loading;
      }
      .film-desc {
        height: 138px;
      }
      .film-desc:before {
        content: "";
        display: inline-block;
        width: 100%;
        height: 16px;
        background: $color-text-loading;
        box-shadow: 0 28px 0 $color-text-loading,
            0 54px 0 $color-text-loading,
            0 82px 0 $color-text-loading,
            0 110px 0 $color-text-loading;
      }

    }
  }

}

@media screen and (max-width: 1699px) {
  .detail {
    .film-infos {
      width: 400px;
      .film-name {
        @include font(32, 40);
      }
      .film-labels {
        margin-top: 32px;
        @include font(18, 32);
      }
      .film-desc {
        @include font(14, 32);
        @include text-line-clamp(8);
        max-height: 256px;
      }
    }
    .movie-player {
      width: 736px;
      height: 414px;
    }
  }
}

@media screen and (max-width: 767px) {
  .detail {
    &-main {
      padding: 0;
    }
    .movie-player {
      float: none;
      width: rem(375);
      height: rem(210.9375);

      &:before {
        display: none;
      }
    }
    .film-infos {
      display: none;
    }
    .film-infos--mobile {
      display: block;
      padding: rem(15);
      .row-box {
        @include flex($jus: flex-start, $ali: stretch);
      }
      .film-cover {
        flex: 0 0 auto;
        margin-right: rem(11);
        width: rem(84);
        height: rem(120);
        border-radius: 4px;
        background: none center no-reapeat;
        background-size: cover;
      }
      .col-box {
        flex: 1 1 auto;
        @include flex(column, space-between, stretch);
      }
      .film-name {
        @include font-m(20, 24);
        color: $color-lightest;
        font-weight: bold;
        @include text-line-clamp(2);
      }
      .film-scores-points {
        margin-top: rem(10);
        @include flex($jus: flex-start);
        .film-points {
          @include font(20, 24);
          color: $color-lightest;
          font-weight: bold;
        }
        /deep/ .progress-stars {
          margin-top: rem(1);
          margin-left: rem(5);
          .star {
            margin-left: rem(6);
            width: rem(16);
            height: rem(16);
            .fill {
              background-size: rem(16) rem(16);
            }
          }
        }
      }
      .film-labels {
        @include font-m(12, 18);
        @include text-line-clamp(1);
      }
      .film-desc {
        margin-top: rem(50);
        .part-title {
          @include font(20, 24);
          color: $color-lightest;
          font-weight: bold;
          margin-bottom: rem(10);
        }
        @include font-m(16, 22);
      }
    }

    &-bottom {
      display: none;
    }
  }
}
</style>
