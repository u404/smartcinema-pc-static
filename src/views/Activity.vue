<template>
  <div class="page_view activity" :class="`activity--${this.type}`">
    <div class="page-bg --blur page-bg--pc" v-image="activityData.bgImage || `https://g.smartcinemausa.com/images/648deac52e884349b032b4254dbd301e-3840-3398.png`"></div>
    <div class="page-bg --blur page-bg--mobile" v-if="activityData.phoneBgImage" v-image="activityData.phoneBgImage"></div>
    <div class="main-wrap activity_main">
      <div class="video-container"  v-if="banner" >
        <div class="banner-bg banner-bg--pc" v-image="banner.bannerImage"></div>
        <div class="banner-bg banner-bg--mobile" v-image="banner.phoneBannerImage"></div>
        <div class="video-box">
          <MoviePlayer
            :data="{ poster: banner.posterUrl, src: banner.bannerType === 3 ? banner.videoUrl : banner.playFilmInfo.videoUrl }"
            @pause="onPause"
            @timeupdate="onTimeUpdate"
            @error="onError" ref="moviePlayer" />
        </div>
      </div>
      <div class="swiper-container" ref="mySwiper" v-else>
        <div class="swiper-wrapper">
          <div class="swiper-slide" :class="{ 'swiper-slide--single': slides.length === 1 }" v-for="(slide, i) in slides" :key="i">
            <div class="film-image film-image--pc" :class="{ '--cursor-pointer': slide.jumpLink }" v-image="slide.bannerImage" @click="loadLink(slide.jumpLink)"></div>
            <div class="film-image film-image--mobile" v-image="slide.phoneBannerImage" @click="loadLink(slide.jumpLink)"></div>
          </div>
        </div>
        <div class="swiper-pagination" v-if="slides.length > 1"></div>
      </div>

      <FilmDrawer type="col-3" v-for="drawer in drawers" :key="drawer.activityId" :title="drawer.title" :data="drawer.movies" @filmclick="film => goFilmDetail(film, drawer.activityId)"></FilmDrawer>
    </div>
    <div class="activity_top">
      <div class="main-wrap"></div>
    </div>
    <div class="activity_bottom">
      <div class="main-wrap"></div>
    </div>
    <HomeHoverButton />
    <SignInDrawer :tag="type" :visiable="signInVisiable" @close="signInDrawerClose" @success="onLoginSuccess" />
  </div>
</template>

<script>
import "swiper/css/swiper.css"
import Swiper from "swiper"
import { mapState } from "vuex"
import _ from "lodash"
// import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper"
import FilmDrawer from "@/components/ActivityFilmDrawer"

import HomeHoverButton from "@/components/HomeHoverButton"

import MoviePlayer from "@/components/MoviePlayerVideojs"

import SignInDrawer from "@/components/SignInDrawer"

import services from "../services"
import logger from "@/logger"

import utils from "../utils"

export default {
  name: "activity",
  components: {
    FilmDrawer,
    HomeHoverButton,
    MoviePlayer,
    SignInDrawer
  },

  props: {
    type: String
  },

  data () {
    return {
      slides: [],
      drawers: [],
      films: [],
      banner: null,
      activityData: {},
      signInVisiable: false
    }
  },
  computed: {
    ...mapState(["userData", "queryData"])
  },

  methods: {

    initSwiper () {
      new Swiper(this.$refs.mySwiper, {
        autoplay: true,
        slidesPerView: "auto",
        centeredSlides: true,
        resizeObserver: true,
        // spaceBetween: 30,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      })
    },
    signInDrawerShow () {
      this.$refs.moviePlayer && this.$refs.moviePlayer.playPause()
      this.signInVisiable = true
    },
    signInDrawerClose () {
      this.signInVisiable = false
    },
    goFilmDetail ({ filmSku }, activityId) {
      this.$router.push({ name: "movie", params: { id: filmSku, act: activityId } })
    },

    getPageData () {
      this.$loading()
      return services.cacheRequest("getActivityData", this.type).then(res => {
        if (!res.banners.length && !res.drawers.length) this.$router.replace({ name: "notFound" })
        this.activityData = res
        this.slides = res.banners
        this.drawers = res.drawers
        this.banner = res.banners.filter(item => {
          return item.bannerType !== 1
        })[0]
        this.$nextTick(() => this.initSwiper())
      }).catch((err) => {
        if (String(err.code) === "106007001") {
          this.$router.replace({ name: "exception", params: { type: "activity_unavailable_in_region" } })
        }
      }).then(() => {
        this.$loading.close()
      })
    },

    loadLink (url) {
      if (!url) return
      location.href = url
    },
    onPause (e) {
      this.uploadProgress(e.currentTime(), 1)
    },

    onTimeUpdate (e) {
      if (this.signInVisiable) {
        this.$refs.moviePlayer && this.$refs.moviePlayer.playPause()
      }
      this.uploadProgressThrottle(e.currentTime())
    },

    uploadProgressThrottle: _.throttle(function (playProgress = 0, reportType = 0) {
      this.uploadProgress(playProgress, reportType)
    }, 30000),

    uploadProgress (playProgress = 0, reportType = 0) {
      if (this.banner.bannerType !== 2) return
      services.updatePlayProgress({ ticketNo: this.banner.playFilmInfo.ticketNo, playProgress, reportType })
    },
    onError (e) {
      if (e && e.code === 400) {
        services.user.setUserToken()
        this.$router.push({ name: "sign-in", query: { from: location.hash.slice(1) } })
      } else if (e && e.msg) {
        this.$alert(e.msg)
      } else if (e && e.message) {
        this.$alert(e.message)
      } else {
        this.$alert("There is something wrong with the page, please check your network")
      }
    },
    onLoginSuccess () {
      this.getPageData()
      this.signInDrawerClose()
    }
  },

  beforeMount () {
    this.getPageData().then(() => {
      if (this.activityData.forceLoginSet && !this.userData.uToken) {
        utils.countdown({
          total: this.activityData.stayTime * 1000,
          ended: () => {
            this.signInDrawerShow()
            // this.$router.replace({ name: "sign-in", query: { from: location.hash.slice(1) } })
          }
        })
      }
    })
  },

  mounted () {
    window.fbq("track", "ViewContent", { content_ids: [this.type], content_type: "product" })
    logger.log("activity_page", { tag: this.type })
  },

  beforeDestroy () {

  }
}
</script>

<style lang="scss" scoped>
.activity {

  &_main {
    padding-top: 40px;
    padding-bottom: 80px;
  }
  .video-container{
    position: relative;
    .banner-bg{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
      &--pc{
        display: block;
      }
      &--mobile{
        display: none;
      }
    }

    width: 100%;
    height: 306px;
    padding-top: 0.1px;
    .video-box{
      width: 544px;
      height: 306px;
      margin: 0 auto;
      /deep/.vjs-big-play-button{
        width: 66px;
        height: 66px;
      }
    }
  }

  .swiper-container {
    width: 100%;
    overflow: hidden;
    .swiper-slide {
      @include flex($jus: center);
    }

    &-horizontal /deep/  > .swiper-pagination-bullets .swiper-pagination-bullet {
      margin: 0 4px;
      width: 8px;
      height: 8px;
      background: rgba(255, 255, 255, 0.9);

      &.swiper-pagination-bullet-active {
        background: #fff;
      }
    }
    .film-image {
      width: 100%;
      height: 306px;
      background: none center no-repeat;
      background-size: 100% 100%;
      border-radius: 12px;

      &--mobile {
        display: none;
      }
    }
  }

  .film-drawer {
    margin-top: 40px;
  }
  .page-bg{
    &--pc{
      display: block;
    }
    &--mobile{
      display: none;
    }
  }

  &--HKIFF2021, &--PCHKIFF2021 {
    @include flex(column, flex-start, stretch);
    .page-bg {
      background-position: center top;
      background-image: url(https://g.smartcinemausa.com/images/313380cbe30b492e985e34c7149981d3-1921-1396.png);
      background-attachment: scroll;
      filter: none;
      &::before {
        display: none;
      }
    }
    .activity_main {
      flex: 1 0 auto;
    }
    .activity_bottom {
      flex: 0 0 auto;
      position: relative;
      height: 160px;
      background: #101010 url(https://g.smartcinemausa.com/images/531823883ba444adb0322d68541ab0af-1200-60.png) center no-repeat;
      @include flex($jus: center);
    }
  }
  &--XIEFEI {
    @include flex(column, flex-start, stretch);
    .activity_main {
      flex: 1 0 auto;
    }
    .activity_bottom {
      flex: 0 0 auto;
      position: relative;
      height: 178px;
      background: #101010 url(https://g.smartcinemausa.com/images/b756a1120d2f4e7d89912bd7e053e7d3-1920-178.png) center no-repeat;
      @include flex($jus: center);
    }

    @include screen-small {
      .activity_bottom {
        height: 160px;
        background-size: 1600px;
      }
    }
  }
}

@include screen-small {
  .activity {
    .video-container{
      height: 217px;
      .video-box{
        width: 386px;
        height: 217px;
        margin: 0 auto;
      }
    }
    .swiper-container {
      .film-image {
        height: 217px;
      }
    }
  }
}

@include screen-mobile {
  .activity {
    background: #25242B;

    &_main {
      padding-top: rem(0);
      padding-bottom: rem(20);
    }
    .video-container{
      position: relative;
      .banner-bg{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
        &--pc{
          display: none;
        }
        &--mobile{
          display: block;
        }
      }
      height: rem(272);
      padding-top: rem(0.1);
      .video-box{
        width: 100%;
        height: rem(196);
        margin-top: rem(38);
        /deep/.vjs-big-play-button{
          width: rem(66);
          height: rem(66);
        }
      }
    }
    .swiper-container {

      .swiper-pagination {
        display: none;
      }
      .swiper-slide {
        width: rem(375);

        &--single {
          width: rem(375);
        }

        // transform: scale(0.9);
        // transition: transform 0.3s;

        &-active,
        &-duplicate-active {
          transform: scale(1);
        }
      }
      .film-image {
        height: rem(204);
        border-radius: rem(0);

        &--mobile {
          display: block;
        }
        &--pc {
          display: none;
        }
      }
    }

    .film-drawer {
      margin-top: rem(0);
    }
    .page-bg {
      display: block;
      &--pc{
        display: none;
      }
      &--mobile{
        display: block;
      }
    }

    &--HKIFF2021, &--PCHKIFF2021 {
      .page-bg {
        display: block;
        background-image: url(https://g.smartcinemausa.com/images/3e2de03677e54921a207e2acf3cfb274-376-1121.png);
      }
      .activity_top {
        flex: 0 0 auto;
        position: relative;
        height: rem(38);
        background: #101010 url(https://g.smartcinema.com.cn/images/e0e9c64b9c45486b9fe201becc4d65b3-345-19.png) center no-repeat;
        background-size: rem(345);
        @include flex($jus: center);
      }
      .activity_bottom {
        display: none;
      }
    }
    &--XIEFEI {
      .activity_bottom {
        display: none;
      }
    }

  }
}
</style>
