<template>
  <div class="page_view movie" :class="{ loading }">
    <transition name="fade">
      <div class="page-bg --blur" v-show="!film.filmImgPath"></div>
    </transition>
    <transition name="fade">
      <div class="page-bg --blur --dark" v-show="film.filmImgPath" :style="{ 'background-image': `url(${film.filmImgPath})` }"></div>
    </transition>
    <div class="main-wrap">
      <div class="movie-main">
        <div class="movie-player_wrap" :class="{ 'movie--loading': loading || !playerReady }">
          <MoviePlayer
            ref="moviePlayer"
            :data="moviePlayerData"
            :ad="{ enabled: SITE_CONFIG.ad.enabled && !isTrailer && film.extend && film.extend.adEnabled, url: SITE_CONFIG.ad.url }"
            :autoplay="autoplay"
            @loaded="onLoaded"
            @firstplay="onFirstPlay"
            @pause="onPause"
            @timeupdate="onTimeUpdate"
            @error="onError"
            @ads-load-start="onAdsLoadStart"
            @ads-load-success="onAdsLoadSuccess"
            @ads-started="onAdsStarted"
            @ads-time-update="onAdsTimeUpdate"
            @ads-completed="onAdsCompleted"
            @ads-error="onAdsError"
            :isTrailer="isTrailer"
          >
          </MoviePlayer>
          <!-- <FollowUs /> -->
        </div>
        <div class="film-infos">
          <div class="row-box">
            <div class="film-cover" v-image="film.filmImgPath"></div>
            <div class="col-box">
              <div class="top-box">
                <div class="film-name">{{film.filmName}}</div>
                <div class="film-labels film-labels--pc">{{ filmLength }}{{ filmRelease && ` | ${filmRelease}` }}</div>
                <div class="film-labels film-length film-labels--mobile">{{filmLength}}</div>
                <div class="film-labels film-labels--mobile">{{ filmRelease }}</div>
                <div class="film-tags">
                  <span class="tag" v-for="tag in film.filmTypeList" :key="tag"  v-show="tag">{{tag}}</span>
                  <span class="tag tag--rating" v-if="SITE_CONFIG.movie.ratingDisplay && film.limitLevel">{{film.limitLevel}}</span>
                </div>
                <div class="film-desc_wrap film-desc_wrap--pc">
                  <div class="film-desc">
                    <div class="part-title">Synopsis</div>
                    {{film.introduction}}
                    <i class="btn film-desc_toggle-btn"></i>
                  </div>
                </div>
                <div class="film-sales film-sales--pc" v-show="!loading && !film.hasTicket">
                  <div class="film-sales_price">$ {{film.price || `0.0`}}</div>
                  <div class="film-sales_paypal">
                    <Paypal :checkoutData="checkoutData" :onPayApprove="onPayApprove" :onPaySuccess="onPaySuccess" :onBuySuccess="onBuySuccess" :onError="onError" :buttonOptions="buttonOptions"></Paypal>
                    <div class="film-sales_paypal_login-mask" v-show="!userData.uToken" @click.self="signInDrawerShow"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="film-desc_wrap film-desc_wrap--mobile">
            <div class="film-desc">
              <div class="wrapper" v-show="film.introduction">
                <input id="exp1" class="exp"  type="checkbox" />
                <div class="text">
                  <label class="btn" for="exp1"></label>
                  {{film.introduction}}
                </div>
              </div>
            </div>
          </div>
          <div class="film-sales film-sales--mobile" v-show="!loading && !film.hasTicket">
            <div class="film-sales_price">$ {{film.price || `0.0`}}</div>
            <div class="film-sales_paypal">
              <Paypal :checkoutData="checkoutData" :onPayApprove="onPayApprove" :onPaySuccess="onPaySuccess" :onBuySuccess="onBuySuccess" :onError="onError" :buttonOptions="buttonOptions"></Paypal>
              <div class="film-sales_paypal_login-mask" v-show="!userData.uToken" @click.self="signInDrawerShow"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <HomeHoverButton @click="onHomeClick" />
    <SignInDrawer :visiable="signInVisiable" @close="signInDrawerClose" @success="onLoginSuccess" />
    <TicketAlert :show="ticketAlert" :cover="film.filmTicketPoster" :autoClose="3000" :title="film.filmName" :release="film.filmReleaseTime" @close="onTicketAlertClose" />
    <i class="scroll-down-tips" v-show="scrollDownTips"></i>
    <div class="page-staticize--loaded" v-if="loaded"></div>
  </div>
</template>

<script>

import { mapState } from "vuex"

// import ProgressStars from "@/components/ProgressStars"

import { setShareMetas } from "@/common/lib/meta"

import MoviePlayer from "@/components/MoviePlayerVideojs"

import Paypal from "@/components/Paypal"

// import FollowUs from "@/components/FollowUs"

import HomeHoverButton from "@/components/HomeHoverButton"

import SignInDrawer from "@/components/SignInDrawer"
import TicketAlert from "@/components/TicketAlert"

import services from "../services"
import logger from "@/logger"

import _ from "lodash"

import { SITE_CONFIG } from "@/define"

import utils from "../utils"

console.log("SITE_CONFIG", SITE_CONFIG)

const [, pathParamAct, pathParamId] = location.pathname.match(/movie_(\d+)_(\d+).html/) || []

export default {
  components: {
    MoviePlayer,
    // ProgressStars,
    Paypal,
    // FollowUs,
    HomeHoverButton,
    SignInDrawer,
    TicketAlert
  },
  inject: ["setHeaderOpacity", "setHeaderRelative"],
  props: {
    // id: String,
    // act: String
  },
  data () {
    return {
      loading: false,
      loaded: false,
      playerReady: false,
      film: {
        filmTypeList: []
      },

      autoplay: true,
      ticketAlert: false,

      buttonOptions: {
        style: {
          layout: "vertical",
          height: 44
        }
      },
      signInVisiable: false,

      scrollDownTips: SITE_CONFIG.movie.scrollDownTips && !window.localStorage["hideScrollDownTips"],

      SITE_CONFIG,

      ...window.__INITIAL_DATA
    }
  },

  computed: {
    ...mapState(["userData", "queryData"]),
    id () {
      return this.queryData.id || pathParamId
    },
    act () {
      return this.queryData.act || pathParamAct
    },
    isTrailer () {
      return !this.film.hasTicket || !this.film.isFilmRelease
    },
    filmLength () {
      return this.film.filmLength && this.$i18n._("{x} min").replace("{x}", this.film.filmLength)
    },
    filmRelease () {
      const { filmReleaseTime, filmReleaseStartTime, isFilmRelease } = this.film
      return (filmReleaseTime || filmReleaseStartTime) && (isFilmRelease ? this.$i18n._("Expires on {x}").replace("{x}", filmReleaseTime) : this.$i18n._("Release on {x}").replace("{x}", filmReleaseStartTime))
    },
    moviePlayerData () {
      return { poster: this.film.filmPoster, src: this.isTrailer ? this.film.filmPreviewUrl : this.film.videoUrl, adLogo: this.film.adLogo }
    }
  },

  watch: {
    film: {
      immediate: true,
      handler (v) {
        if (v.extend && v.extend.forceLogin && !this.userData.uToken) {
          utils.countdown({
            total: v.extend.forceLoginDelay * 1000,
            ended: () => {
              if (v.extend.forceLoginForce) {
                location.replace(`sign-in.html?from=${encodeURIComponent(location.href)}`)
              } else {
                this.signInDrawerShow()
              }
            }
          })
        }
      }
    }
  },

  methods: {
    log (event, data) {
      logger.log(event, {
        film_name: this.film.filmName,
        has_ticket: this.film.hasTicket,
        ...data
      })
    },
    logAd (event, data) {
      this.log(event, {
        ticket_no: this.film.ticketNo,
        sku_id: this.id,
        ...data
      })
    },
    signInDrawerShow () {
      this.autoplay = false
      this.$refs.moviePlayer && this.$refs.moviePlayer.playPause()
      this.signInVisiable = true
    },
    signInDrawerClose () {
      this.autoplay = true
      this.signInVisiable = false
    },
    onLoginSuccess () {
      this.getData()
      this.signInDrawerClose()
    },

    getData () {
      this.loading = true
      let ticketChannel = this.queryData.channel
      // this.$loading()
      services.getMovieData(this.id, this.act, ticketChannel).then(res => {
        // this.$loading.close()
        this.film = res
        this.loading = false
        this.setHeaderOpacity(true)
        this.setHeaderRelative(true)
        this.log("film_detail_page")

        const ticketAlert = SITE_CONFIG.movie.ticketAlert && res.isFirstGiveTicket && res.extend && res.extend.ticketAlert
        // 站点要求弹窗 && 免费 && 有票 && 扩展字段开启，则禁止自动播放，并弹出赠票窗口
        if (ticketAlert) {
          this.autoplay = false
          this.ticketAlert = true
        }

        this.loaded = true

        const script = document.createElement("script")
        script.innerHTML = `window.__INITIAL_DATA=${JSON.stringify({ film: res, autoplay: !ticketAlert, ticketAlert: !!ticketAlert })};`
        document.querySelector("div").after(script)
      }).catch((err) => {
        // this.$loading.close()
        if (String(err.code) === "113001001") {
          location.replace(`exception.html?type=movie_unavailable_in_region`)
          return
        }
        this.$alert("load fail! please back and retry.")
      })
    },

    goSignIn () {
      location.replace(`sign-in.html?from=${encodeURIComponent(location.href)}`)
    },

    onLoaded () {
      this.playerReady = true
    },

    onFirstPlay () {
      this.log("film_detail_play_success")
    },
    onePageTouch () {
    },

    checkoutData () {
      window.fbq && window.fbq("track", "InitiateCheckout")
      if (!this.userData.uToken) {
        this.signInDrawerShow()
        return null
      }
      return {
        skuId: this.id,
        buyNumber: 1
      }
    },

    onPayApprove () {
      this.$loading()
    },

    onPaySuccess (data, details) {
      const detail = details.purchase_units && details.purchase_units[0]
      window.fbq && window.fbq("track", "Purchase", {
        content_type: "product", //  固定值：pruduct
        content_ids: [this.id], // 购买产品的 id或者Sku
        value: detail && detail.amount.value, // 购买产品的总价值
        currency: detail && detail.amount.currency_code // 货币类型
      })
    },

    onBuySuccess () {
      this.$loading.close()
      this.getData()
    },

    onError (e) {
      console.log(e)
      if (e && e.code === 400) {
        services.user.setUserToken()
        this.signInDrawerShow()
      } else if (e && e.msg) {
        this.$alert(e.msg)
      } else if (e && e.message) {
        this.$alert(e.message)
      } else {
        this.$alert("There is something wrong with the page, please check your network")
      }
    },

    onHomeClick () {
      this.log("film_detail_gohome")
    },

    onPause (e) {
      this.uploadProgress(e.currentTime(), 1)
    },

    onTimeUpdate (e) {
      this.uploadProgressThrottle(e.currentTime())
    },

    uploadProgressThrottle: _.throttle(function (playProgress = 0, reportType = 0) {
      this.uploadProgress(playProgress, reportType)
    }, 30000),

    uploadProgress (playProgress = 0, reportType = 0) {
      if (!this.film.hasTicket) return
      services.updatePlayProgress({ ticketNo: this.film.ticketNo, playProgress, reportType })
    },

    onTicketAlertClose () {
      this.ticketAlert = false
      this.$refs.moviePlayer.play()
    },

    onAdsLoadStart () {
      this.logAd("web_ads_file_request")
    },
    onAdsLoadSuccess () {
      this.logAd("web_ads_file_response", { status: "成功" })
    },
    onAdsStarted (ad) {
      this._playingAd = { ads_duration: ad.getDuration(), ads_title: ad.getTitle(), ads_des: ad.getDescription() }
      this.logAd("web_ads_video_play", this._playingAd)
    },
    onAdsTimeUpdate ({ remainingTime, duration }) {
      if (this._playingAd) {
        this._playingAd.ads_time = duration - remainingTime
      }
    },
    onAdsCompleted () {
      this.logAd("web_ads_video_play_stop", { ...this._playingAd, stop_type: "正常结束" })
      this._playingAd = null
    },
    onAdsError (err) {
      if (err.type === "adLoadError") {
        this.logAd("web_ads_file_response", { status: "失败", errorcode: err.errorCode, errormsg: err.errorMessage })
      } else if (err.type === "adPlayError") {
        this.logAd("web_ads_video_load_failed", { ...this._playingAd, errorcode: err.errorCode, errormsg: err.errorMessage })
      }
      this._playingAd = null
    }

  },

  beforeMount () {
    setShareMetas({
      title: this.film.filmName,
      description: this.film.introduction,
      image: this.film.filmImgPath
    })
    if (!window.__INITIAL_DATA) {
      this.getData()
    }
  },
  mounted () {
    this.onePageTouch()
    if (this.scrollDownTips) {
      window.addEventListener("scroll", _.throttle(() => {
        if (this.scrollDownTips) {
          this.scrollDownTips = false
          window.localStorage["hideScrollDownTips"] = 1
        }
      }))
    }
  },
  beforeDestroy () {
    if (this._playingAd) {
      this.logAd("web_ads_video_play_stop", { ...this._playingAd, stop_type: "用户退出" })
    }
    this.setHeaderOpacity(false)
    this.setHeaderRelative(false)
  }
}
</script>

<style lang="scss">
@keyframes jump {
  0% {
    transform: translateY(-70%);
  }
  100% {

  }
}

.movie {

  .main-wrap {
    @include screen-pc {
      width: 100%;
      min-width: 1200px;
    }
  }

  @mixin content-wrap {
    @include screen-pc {
      width: 75vw;
      max-width: 1400px;
      min-width: 1200px;
    }
  }

  &-main {
    overflow: hidden;
    margin: 0 auto;
  }

  .movie-player {
    & {
      width: 100%;
      height: auto;
      padding-top: 56.25%;
      position: relative;

      .video-js {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      &.--hidden {
        visibility: hidden;
      }
    }
    &_wrap {
      flex: 0 0 auto;
      margin: 0 auto;
      @include content-wrap;
      position: relative;
      &.movie--loading {
        .movie-player {
          // visibility: hidden;
          .video-js {
            display: none;
          }
        }
        &:after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #000;
          background: url(https://g.smartcinemausa.com/images/8c985d11dcc247878f342429177c1e8e-340-340.gif)
            center no-repeat;
          background-size: 170px;
        }
      }
    }

    &-fullscreen:before {
      display: none;
    }

  }

  .follow-us {
    margin-top: 70px;
    display: none;
  }

  .film-infos {
    padding: 40px 0 50px;
    flex: 1 1 auto;
    overflow: hidden;
    background-image: linear-gradient(180deg, rgba(18, 18, 18, 0) 22px, rgba(18, 18, 18, 1) 122px);

    .row-box {
      margin: 0 auto;
      @include content-wrap;
      @include flex($jus: flex-start, $ali: stretch);
    }
    .film-cover {
      flex: 0 0 auto;
      margin-right: 50px;
      width: 11.825vw;
      height: 15.885vw;
      min-width: 194.6px;
      min-height: 261.4px;
      border-radius: 6px;
      background: none center no-reapeat;
      background-size: cover;
    }
    .col-box {
      flex: 1 1 auto;
      @include flex(column, space-between, stretch);
      overflow: hidden;
    }
    .film-name {
      @include font(38, 66);
      color: $color-dark;
      font-weight: 500;
      @include text-line-clamp(2);
    }
    .film-scores-points {
      margin-top: 20px;
      @include flex($jus: flex-start);
      .film-points {
        @include font(18, 18);
        color: $color-dark;
        font-weight: bold;
      }
      .progress-stars {
        margin-left: 5px;
        .star {
          margin-left: 5px;
          width: 16px;
          height: 16px;
          .fill {
            background-size: 16px 16px;
          }
        }
      }
    }
    .film-labels {
      @include font(18, 25);
      @include text-overflow;
      margin-top: 20px;
      color: #7F7E84;

      &-wrap {
        @include flex($jus: flex-start);
      }

      &--pc {
        display: block;
      }

      &--mobile {
        display: none;
      }
    }

    .film-tags {
      margin-top: 12px;
      .tag {
        display: inline-block;
        margin-top: 8px;
        @include font(12, 17);
        color: rgba(255, 255, 255, 0.65);
        font-weight: bold;
        background: #525157;
        border-radius: 10px;
        padding: 2px 5px;
        margin-right: 5px;

        &--rating {
          background: #fff;
          color: #DD2C2C;
        }
      }
    }
    .film-desc {
      &_wrap {
        margin-top: 20px;
        &--pc{
          display: block;
        }
        &--mobile{
          display: none;
        }
      }

      .part-title {
        display: none;
      }
      @include font(16, 32);
      @include text-line-clamp(10);
      color: #b8b8b8;
    }
    .film-sales {
      margin-top: 30px;
      &_price {
        @include font(24, 33);
        color: #ff314a;
        font-weight: 600;
      }
      &_paypal {
        margin-top: 12px;
        width: 220px;
        position: relative;
        &_login-mask {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          z-index: 100;
          cursor: pointer;
        }
      }

      &--pc {
        display: block;
      }
      &--mobile {
        display: none;
      }
    }
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

  .scroll-down-tips {
    position: fixed;
    bottom: 10px;
    left: 50%;
    margin-left: -36px;
    width: 72px;
    height: 40px;
    background: url(https://g.smartcinemausa.com/images/98223e33e56343b691dfc89e4e06235b-72-40.png) center no-repeat;
    background-size: contain;
    animation: jump 0.6s ease-in infinite alternate;
  }
}

@include screen-mobile {
  .movie {
    padding: 0;
    &-main {
      display: block;
    }
    .movie-player {
      width: rem(375);
      height: rem(210.9375);
      padding: 0;
      &_wrap {
        width: 100%;
        max-width: auto;
        min-width: auto;
        &.movie--loading {
          &:after {
            background-size: rem(120);
          }
        }
      }
      &:before {
        display: none;
      }
    }
    .film-infos {
      display: block;
      padding: rem(15);
      background-image: none;

      .row-box {
        @include flex($jus: flex-start, $ali: stretch);
      }
      .film-cover {
        flex: 0 0 auto;
        margin-right: rem(11);
        width: rem(116);
        height: rem(165);
        min-width: auto;
        min-height: auto;
        border-radius: rem(3);
        background: none center no-reapeat;
        background-size: cover;
      }
      .col-box {
        flex: 1 1 auto;
        @include flex(column, space-between, stretch);
      }
      .film-name {
        @include font-m(20, 22.5);
        color: $color-lightest;
        font-weight: bold;
        @include text-line-clamp(2);
        margin-top: rem(10);
      }
      .film-scores-points {
        margin-top: rem(10);
        @include flex($jus: flex-start);
        .film-points {
          @include font(20, 24);
          color: $color-lightest;
          font-weight: bold;
        }
        .progress-stars {
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
        @include font-m(12, 17);
        @include text-line-clamp(1);
        margin-top: rem(2);
        color: #7F7E84;

        &--pc {
          display: none;
        }

        &--mobile {
          display: block;
        }
      }
      .film-length{
        margin-top: rem(10);
      }
      .film-tags{
        .tag{
          display: inline-block;
          margin-top: rem(10);
          @include font-m(10, 14);
          color: rgba(255, 255, 255, 0.65);
          font-weight: bold;
          background: #525157;
          border-radius: rem(9);
          padding: rem(3) rem(10);
          border-radius: rem(9);
          margin-right: rem(4);
        }
      }
      .film-desc {
        &_wrap {
          margin-top: 0;
          height: auto;
          &--pc{
            display: none;
          }
          &--mobile{
            display: block;
          }
        }
        margin-top: rem(21);
        font-weight: 300;
        .part-title {
          display: block;
          @include font(20, 24);
          color: $color-lightest;
          font-weight: bold;
          margin-bottom: rem(10);
        }
        color: #FFFFFF;
        @include font-m(14, 20);
        @include text-line-clamp(20);
        .wrapper {
          display: flex;
          width: 100%;
          overflow: hidden;
        }
        .text {
          @include font-m(14, 20);
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
          position: relative;
          max-height: rem(60);
          transition: 1s max-height;
        }
        .text::before {
          content: '';
          height: calc(100% - 0.9em);
          float: right;
        }
        .text::after {
          content: '';
          width: 999vw;
          height: 999vw;
          position: absolute;
          box-shadow: inset -972.3334vw -991vw 0 0 #25242B;
          margin-left: rem(-100);
        }
        .btn{
          @include font-m(14, 19);
          position: relative;
          float: right;
          clear: both;
          margin-left: rem(20);
          color:  #fff;
          cursor: pointer;
        }
        .btn::after{
          content:'';
          background: url(https://g.smartcinemausa.com/images/97189e06c4954cadb71f1c06df17f707-26-14.png) 0 0 no-repeat;
          background-size: cover;
          width: rem(12);
          height: rem(6);
        }
        .exp{
          display: none;
        }
        .exp:checked+.text{
          max-height: none;
        }
        .exp:checked+.text::after{
          visibility: hidden;
        }
        .exp:checked+.text .btn::before{
          visibility: hidden;
        }
        .exp:checked+.text .btn{
          margin-left: 0;
        }
        .exp:checked+.text .btn::after{
          content:'';
          background: url(https://g.smartcinemausa.com/images/06c20c1acd3946aeac6aa995a6e0f6df-24-12.png) 0 0 no-repeat;
          background-size: cover;
          width: rem(12);
          height: rem(6);
        }
        .btn::before{
          content: '';
          position: absolute;
          left: rem(-5);
          color: #FFFFFF;
          transform: translateX(-100%)
        }
      }
      .film-sales {
        margin-top: rem(25);
        &::before{
          content: "";
          display: block;
          width: rem(342);
          margin: 0 auto rem(30);
          height: rem(1);
          background: linear-gradient(270deg, rgba(62, 62, 62, 0) 0%, rgba(62, 62, 62, 0.65) 4%, #3E3E3E 96%, rgba(62, 62, 62, 0) 100%);
          opacity: 0.75;
        }
        &_price {
          text-align: center;
        }
        &_paypal {
          margin: rem(12) auto 0;
          width: rem(240);
        }

        &--pc {
          display: none;
        }
        &--mobile {
          display: block;
        }
      }
    }

    &-bottom {
      display: none;
    }

    .scroll-down-tips {
      display: none;
    }
  }
}
</style>
