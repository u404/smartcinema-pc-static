<template>
  <div class="page_view home">
    <div class="page-bg --blur"></div>
    <div class="main-wrap">
      <div class="swiper-container" ref="mySwiper">
        <div class="swiper-wrapper">
          <div class="swiper-slide" :class="{ 'swiper-slide--single': slides.length === 1 }" v-for="(slide, i) in slides" :key="i">
            <div class="film-image film-image--pc" :class="{ '--cursor-pointer': slide.jumpLink }" v-image="slide.bannerImage" @click="loadLink(slide.jumpLink)"></div>
            <div class="film-image film-image--mobile" v-image="slide.phoneBannerImage" @click="loadLink(slide.jumpLink)"></div>
          </div>
        </div>
        <!-- Add Pagination -->
        <div class="swiper-pagination" v-if="slides.length > 1"></div>
      </div>
      <FilmDrawer v-for="drawer in drawers" :key="drawer.activityId" :title="drawer.title" :data="drawer.movies" @filmclick="film => goFilmDetail(film, drawer.activityId)"></FilmDrawer>
    </div>
  </div>
</template>

<script>
import "swiper/css/swiper.css"
import Swiper from "swiper"
// import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper"
import FilmDrawer from "@/components/FilmDrawer"

import services from "@/services"
import logger from "@/logger"

export default {
  name: "home",
  components: {
    FilmDrawer
  },

  data () {
    return {
      slides: [],
      drawers: [],

      ...window.__INITIAL_DATA
    }
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

    goFilmDetail ({ filmSku }, activityId) {
      if (window.__SERVER_RENDERED) {
        location.href = `movie_${activityId}_${filmSku}.html`
      } else {
        location.href = `movie.html?act=${activityId}&id=${filmSku}`
      }
    },

    getPageData () {
      this.$loading()
      services.cacheRequest("getHomeData").then(res => {
        this.slides = res.banners
        this.drawers = res.drawers
        const script = document.createElement("script")
        script.innerHTML = `window.__INITIAL_DATA=${JSON.stringify({ slides: this.slides, drawers: this.drawers })};`
        document.querySelector("div").after(script)
        this.$nextTick(() => this.initSwiper())
      }).catch(() => {}).then(() => {
        this.$loading.close()
      })
    },

    loadLink (url) {
      if (!url) return
      location.href = url
    }
  },

  beforeMount () {
    if (!window.__INITIAL_DATA) {
      this.getPageData()
    }
  },

  mounted () {
    logger.log("home_page")
    if (this.slides.length) {
      this.$nextTick(() => this.initSwiper())
    }
  },

  activated () {

  },

  beforeDestroy () {
  }
}
</script>

<style lang="scss" scoped>
.home {
  padding-top: 40px;
  padding-bottom: 80px;
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
}

@include screen-small {
  .home {
    .swiper-container {
      .film-image {
        height: 217px;
      }
    }
  }
}

@include screen-mobile {
  .home {
    padding: 0;
    padding-bottom: rem(20);
    background-color: #25242B;
    .swiper-container {
      .swiper-pagination {
        display: none;
      }
      .swiper-slide {
        width: rem(320);

        &--single {
          width: rem(345);
        }

        transform: scale(0.9);
        transition: transform 0.3s;

        &-active,
        &-duplicate-active {
          transform: scale(1);
        }
      }
      .film-image {
        height: rem(180);
        border-radius: rem(8);

        &--mobile {
          display: block;
        }
        &--pc {
          display: none;
        }
      }
    }

    .film-drawer {
      margin-top: rem(30);
    }
  }
}
</style>
