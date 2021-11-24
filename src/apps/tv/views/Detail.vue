<template>
  <div class="detail" :class="{ loading }">
    <div class="detail-content">
      <div class="film-image" v-image="film.filmImgPath"></div>
      <div class="film-infos">
        <div class="film-infos-main">
          <div class="film-name">{{film.filmName}}</div>
          <div class="film-labels">{{film.filmDesc}}</div>
          <div class="film-desc">{{film.introduction}}</div>
        </div>
        <div class="film-price free" v-if="film.free">This movie is free</div>
        <div class="film-price" v-else-if="film.price">$ {{film.price}}</div>

        <div class="flex-box">
          <div class="film-btns" v-if="paySuccess" key="film-btns">
            <div class="btn disabled">Purchased</div>
            <!-- <div class="btn back-btn">Back</div> -->
          </div>
          <div class="paypal-container" v-else key="paypal">
            <div class="paypal-buttons" ref="paypal"></div>
          </div>
          <!-- <div class="app-downloads">
            <div class="app-downloads-tips">Click the link below to download the app</div>
            <div class="app-downloads-links">
              <a href="https://apps.apple.com/us/app/id1471108952" target="_blank"><img src="https://g.smartcinemausa.com/images/756710489621447fa669e12d206b1a8b-157-48.png" alt=""></a>
              <a href="https://play.google.com/store/apps/details?id=us.android.mingzhi.motv" target="_blank"><img src="https://g.smartcinemausa.com/images/157a0e4fff4b4891abd25d1b2433dc15-155-46.png" alt=""></a>
            </div>
          </div> -->
        </div>

      </div>
    </div>
    <div class="detail-content-m">
      <div class="film-image" v-image="film.filmImgPathHor"></div>
      <div class="film-infos">
        <div class="film-info-item film-name">{{film.filmName}}</div>
        <div class="film-info-item film-release"><b>Expires on {{film.filmReleaseTime}}</b></div>
        <div class="film-info-item film-price">Unit Price <b>$ {{film.price}}</b></div>
        <div class="film-btns" v-if="paySuccess" key="film-btns">
          <div class="btn disabled">Purchased</div>
        </div>
        <div class="paypal-container" v-else key="paypal">
          <div class="paypal-buttons" ref="paypalM"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import env from "@sc/lib-env"
import services from "@/services"
import paypalHelper from "@/common/lib/paypal"

import reporter from "@sc/lib-amplitude"
import { queryString } from "@sc/lib-web-utils-intl"

const queryData = queryString.parse(location.search)

const code = queryData.code || location.pathname.replace("/tv/", "")

export default {
  data () {
    return {
      loading: false,
      film: {
        filmImagePath: "",
        filmName: "",
        filmDesc: "",
        introduction: ""
      },
      paySuccess: false
    }
  },

  methods: {

    getVizioBuyInfo () {
      this.loading = true
      this.$loading()
      services.getVizioBuyInfo(code).then(res => {
        this.$loading.close()
        this.film = res
        this.loading = false
        reporter.setBase({ sku_id: res.skuId, film_name: res.filmName, client_type: env.os.isMobile ? "mobile" : "pc" })
        reporter.track("vizio_pay_page")
      }).catch((err) => {
        this.$loading.close()
        this.$emit("error", err)
      })
    },

    renderPaypal (wrap) {
      return paypalHelper.render(wrap, {
        checkoutData: (data, actions) => {
          reporter.track("vizio_pay_page_paybutton")
          return {
            skuId: this.film.skuId,
            buyNumber: 1
          }
        },
        onPayApprove: () => {
          this.$loading({ msg: "Querying payment results..." })
        },
        onPaySuccess: (data, details) => {
          reporter.track("vizio_pay_success")
        },
        onBuySuccess: () => {
          this.$loading.close()
          this.paySuccess = true
        },
        onError: (e) => {
          if (e && e.code === 400) {
          } else if (e && e.msg) {
            this.$alert(e.msg)
            return
          }
          this.$emit("error", e)
        },
        onCancel: (e, details) => {
          reporter.track("vizio_pay_cancel")
        },
        buttonOptions: {
          style: {
            layout: "vertical",
            height: 40
          }
        }
      })
    }
  },

  beforeMount () {
    this.getVizioBuyInfo()
  },
  mounted () {
    this.renderPaypal(this.$refs.paypal)
    this.renderPaypal(this.$refs.paypalM)
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/mixins.scss";
.detail {
  margin: 0 auto;
  max-width: 1200px;
  padding: 76px 80px;
  position: relative;
  .detail-content {
    @include flex($jus: flex-start, $ali: flex-start);

    .film-image {
      flex: 0 0 auto;
      margin-right: 60px;
      width: 224px;
      height: 320px;
      background: none center no-repeat;
      background-size: cover;
    }
    .film-infos {
      flex: 1 1 auto;
      color: $color-lightest;
      font-weight: 400;
      @include flex(column, flex-start, stretch);

      .film-name {
        flex: 0 0 auto;
        @include font(24, 30);
        font-weight: bold;
      }
      .film-labels {
        flex: 0 0 auto;
        margin-top: 14px;
        @include font(14, 28);
        color: $color-lighter;
        @include text-line-clamp(2);
      }
      .film-desc {
        flex: 0 0 auto;
        margin-top: 20px;
        @include font(16, 28);
      }
      .film-padding {
        flex: 1 1 auto;
      }
    }
    .film-price {
      margin-top: 22px;
      @include font(24, 33);
      font-weight:bold;
      color: #FF4062;
      &.free {
        @include font(20, 28);
      }
    }

    .flex-box {
      margin-top: 20px;
      flex: 0 0 auto;
      @include flex($ali: flex-start);
    }

    .film-btns {
      flex: 0 0 auto;
      @include flex($jus: flex-start);
      .btn {
        margin-right: 15px;
        width: 184px;
        height: 40px;

        border-radius: $border-radius-default;
        @include font(18, 22);
        font-weight: 500;

        background: $color-lightest;
        color: $color-darkest;

        &.disabled {
          background: #272727;
          color: $color-normal;
        }
      }
    }
    .paypal-container {
      @include flex($jus: flex-start);
      position: relative;
      .paypal-buttons {
        flex: 0 0 auto;
        width: 260px;
      }
      .nologin-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 260px;
        bottom: 0;
        z-index: 999;
        cursor: pointer;
      }
    }

    .app-downloads {
      position: fixed;
      top: 40%;
      right: 10px;
      &-tips {
        display: none;
        @include font(14, 20);
      }
      &-links {
        a {
          display: block;
          margin-top: 10px;
        }
        img {
          display: block;
        }
      }
    }

  }

  &.loading .detail-content {
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

  .detail-content-m {
    display: none;
    .film-image {
      display: block;
      height: rem(211);
      background: none center no-repeat;
      background-size: cover;
    }
    .film-infos {
      .film-info-item {
        margin: 0 rem(10);
        padding: rem(18) 0;
        border-bottom: 1px solid $color-border-light-m;
        b {
          color: $color-important-m;
        }
      }
      .film-name {
        padding: rem(20) 0;
        @include font(20, 28);
        font-weight: 600;
        color: $color-darker-m;
      }
      .film-release {
        @include font(14, 20);
      }
      .film-price {
        @include font(16, 22);
      }
    }
    .film-btns {
      margin: rem(50) $page-margin 0;
      padding-bottom: rem(30);
      .btn {
        height: rem(44);
        background: #272727;
        border-radius: $border-radius-default;
        @include font(18, 22);
        font-weight: 500;

        background: $color-lightest;
        color: $color-darkest;

        &.disabled {
          background: #272727;
          color: $color-normal;
        }
      }
    }
    .paypal-container {
      margin: rem(50) $page-margin 0;
    }
  }
}

@media screen and (max-width: 767px) {
  .detail {
    margin: 0;
    padding: 0;
    .detail-content {
      display: none;
    }
    .detail-content-m {
      display: block;
      width: 100%;
    }
  }
}
</style>
