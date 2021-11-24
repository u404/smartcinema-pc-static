<template>
  <div class="page" >
    <div class="page_header" :class="{ 'page_header--opacity': headerOpacity, 'page_header--relative': headerRelative }">
      <div class="page_header_content main-wrap">
        <a class="logo" :class="SITE_CONFIG.logoClass" href="#/home"></a>
        <UserNav />
      </div>
    </div>
    <!-- <keep-alive include="home"> -->
      <slot></slot>
    <!-- </keep-alive> -->
    <div class="page_footer">
      <div class="page_footer_main">
        <div class="main-wrap">
          <FollowUs />
          <div class="logo" :class="SITE_CONFIG.logoClass">
            <i></i>
            <!-- <img src="https://g.smartcinemausa.com/images/f221dba195ee4bf8b9ac7865dc8bb38b-350-120.png" alt=""> -->
          </div>
          <DownLoadIcon v-show="!SITE_CONFIG.hideDownloadLink" />
          <div class="link-us" v-show="!SITE_CONFIG.hideLinkUs">Contact us at smartcinema_usa@smartcinema.com.cn</div>
          <div class="copyright">Copyright © 2019 by {{SITE_CONFIG.smartcinemaName}}</div>
        </div>
      </div>
    </div>
    <!-- <a class="page_home-hover-button" v-show="$route.name !== 'home'" href="#/home"></a> -->
  </div>
</template>

<script>
import UserNav from "@/components/UserNav"
import FollowUs from "@/components/FollowUs"
import DownLoadIcon from "@/components/DownLoadIcon"

import { SITE_CONFIG } from "@/define"

export default {
  name: "page",
  components: {
    UserNav,
    FollowUs,
    DownLoadIcon
  },
  data () {
    return {
      SITE_CONFIG,
      headerOpacity: false,
      headerRelative: false
    }
  },

  computed: {
  },

  methods: {
    setHeaderOpacity (bool) {
      console.log("setOpacity", bool)
      this.headerOpacity = bool
    },
    setHeaderRelative (bool) {
      this.headerRelative = bool
    }
  },

  provide () {
    return {
      setHeaderOpacity: this.setHeaderOpacity,
      setHeaderRelative: this.setHeaderRelative
    }
  },

  beforeMount () {

  },

  mounted () {
  }

}
</script>

<style lang="scss">
.page {
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  position: relative;
  @include flex(column, flex-start, stretch);
  // transform: translateZ(0);

  &-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(https://g.smartcinemausa.com/images/648deac52e884349b032b4254dbd301e-3840-3398.png) center no-repeat;
    background-size: cover;
    background-attachment: fixed;
    transform: translateZ(0);

    &:before {
      content: "";
      display: block;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.47);
    }

    &.--blur {
      filter: blur(25px);
      transform: translate3d(0,0,0);
    }
    &.--dark:before {
      background: rgba(0, 0, 0, 0.71);
    }
  }

  &_header {
    position: sticky;
    top: 0;
    background: $bg-body;
    transition: background ease 0.3s;
    z-index: 10;
    &_content {
      margin: 0 auto;
      height: 60px;
      @include flex;
      .logo {
        flex: 0 0 auto;
        width: 199px;
        height: 28px;
        background: url(https://g.smartcinemausa.com/images/4224a455e7a4414395df14bdd5eab021-398-56.png) center no-repeat;
        background-size: contain;

        &-tw {
          width: 140px;
          height: 21px;
          background-image: url(https://g.smartcinemausa.com/images/86a357a0ba904503ad9f6393a42f9270-280-42.png);
        }
      }
      .user-nav {
        flex: 0 0 auto;
      }
    }

    &--opacity {
      background: linear-gradient(180deg, #1D1D1D 0%, rgba(29, 29, 29, 0.52) 48%, rgba(29, 29, 29, 0) 100%);
    }
    &--relative {
      position: relative;
    }
  }
  &_view {
    flex: 1 0 auto;
    @include flex(column nowrap, flex-start, stretch);
  }
  &_footer {
    flex: 0 0 auto;
    position: relative;
    .main-wrap {
      position: relative;
    }
    &_main {
      padding: 22px 0;
      background: $bg-body;
      @include font(12, 22);
      color: rgb(160, 160, 159);
      text-align: center;
      .logo {
        margin-bottom: 10px;
        i {
          margin: 0 auto;
          display: block;
          width: 145px;
          height: 60px;
          background: url(https://g.smartcinemausa.com/images/f221dba195ee4bf8b9ac7865dc8bb38b-350-120.png) center no-repeat;
          background-size: contain;
        }

        &-tw i {
          width: 213px;
          height: 32px;
          background-image: url(https://g.smartcinemausa.com/images/37d30653988a4fa1a7361c8271b8545b-426-64.png);
        }
      }

      .follow-us, .download-icon {
        position: absolute;
        right: 0;
        top: -14px;
        // transform: translateY(-50%);
      }
      .download-icon{
        top: 39px;
      }
    }
  }

  &_home-hover-button {
    position: fixed;
    right: 0;
    top: 50%;
    margin-top: -20px;
    width: 40px;
    height: 40px;
    border-radius: 6px 0px 0px 6px;
    background: rgba(0, 0, 0, 0.35) url(https://g.smartcinemausa.com/images/2c343ac3bc0045be8bd04d1d9565edc0-40-40.png) center no-repeat;
    background-size: 20px;
  }
}

.main-wrap {
  margin: 0 auto;
  width: 1680px;
  position: relative;
}

@include screen-small {
  .page {
    min-width: 1200px;
  }
  .main-wrap {
    width: 1200px;
  }
}

@include screen-mobile {
  $bg-body: #25242B;
  body {
    background: $bg-body;
  }

  .main-wrap {
    width: 100%;
  }

  .page {
    &-bg {
      display: none;
    }
    &_header {
      background-color: #25242B;
      position: relative;
      &_content {
        height: auto;
        padding: rem(15) rem(20);
        .logo {
          width: rem(167);
          height: rem(20);
          background-size: cover;

          &-tw {
            width: rem(135);
            height: rem(20);
          }
        }
      }
    }
    &_footer {
      &_main {
        background: #201F26;
        padding: rem(20) 0;
        @include font(10, 18);
        .logo {
          &::before{
            content: "";
            display: block;
            width: rem(342);
            height: rem(1);
            margin: rem(20) auto 0;
            background: linear-gradient(270deg, rgba(62, 62, 62, 0) 0%, rgba(62, 62, 62, 0.65) 4%, #3E3E3E 96%, rgba(62, 62, 62, 0) 100%);
            opacity: 0.32;
          }
          // margin-top: rem(15);
          margin-bottom: rem(10);
          i {
            width: rem(105);
            height: rem(36);
            display: block;
            margin:rem(17) auto 0;
          }
          &-tw i {
            width: rem(140);
            height: rem(21);
          }
        }
      }
      .follow-us, .download-icon {
        position: relative;
        right: auto;
        top: auto;
        transform: none;
        margin: 0 auto;
      }
    }
  }

  .h5-alert {
    &-body {
      padding: 0 rem(30);
    }
    &-msg {
      padding: rem(15) rem(20);
      @include font-m(16, 24);
    }
  }
}
</style>
