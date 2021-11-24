<template>
  <div class="ticket-alert">
    <transition name="fade">
      <div class="ticket-alert_mask" v-show="show"></div>
    </transition>
    <transition name="slideDown">
      <div class="ticket-alert_main" v-show="show">
        <div class="ticket-alert_title">恭喜您獲得一張電影票</div>
        <div class="ticket-alert_card">
          <div class="ticket-alert_card_cover" :style="{ backgroundImage: `url(${cover})` }"></div>
          <i class="ticket-alert_card_logo"></i>
          <div class="ticket-alert_card_info">
            <div class="film-title">{{title}}</div>
            <div class="film-release">{{release}} 下片</div>
          </div>
        </div>
        <div class="btn ticket-alert_button" @click="close">進電影院觀看</div>
        <i class="btn ticket-alert_close" @click="close"></i>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    autoClose: {
      type: Number,
      default: 0
    },
    cover: String,
    title: String,
    release: String
  },
  watch: {
    show: {
      immadiate: true,
      handler (v) {
        if (v && this.autoClose) {
          if (this._closeTimer) {
            clearTimeout(this._closeTimer)
          }
          this._closeTimer = setTimeout(() => this.close(), this.autoClose)
        }
      }
    }
  },

  methods: {
    close () {
      this.$emit("close")
    }
  }
}
</script>

<style lang="scss">
.ticket-alert {
  &_mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2000;
    background: rgba(0, 0, 0, 0.71);
  }
  &_main {
    position: fixed;
    top: 50%;
    left: 50%;
    margin-top: -306px;
    margin-left: -203px;
    z-index: 2000;

    width: 406px;
    height: 612px;
    padding: 40px 15px 30px;
    background: #2A292B;
    border-radius: 12px;

    @include flex(column, flex-start, center);

  }

  &_title {
    width: 330px;
    height: 34px;
    @include flex($jus: center);
    background: linear-gradient(90deg, rgba(238, 238, 238, 0) 0%, rgba(155, 155, 155, 0.39) 53%, rgba(216, 216, 216, 0) 100%);
    // opacity: 0.39;
    font-size: 20px;
    font-weight: 600;
    color: #FAE7AC;
  }

  &_card {
    width: 374px;
    height: 380px;
    padding: 22px;
    background: url(https://g.smartcinemausa.com/images/7661ca53528548acadb68f2f6fab417e-748-760.png) center no-repeat;
    background-size: contain;
    position: relative;

    &_logo {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 182px;
      height: 61px;
      background: url(https://g.smartcinemausa.com/images/efdf31687c2d4e75a101b65d1b2c214e-364-122.png) center no-repeat;
      background-size: contain;
    }

    &_cover {
      height: 207px;
      background: none center no-repeat;
      background-size: cover;
      border-radius: 12px 12px 0 0;
      position: relative;
      overflow: hidden;
      &:after {
        content: "";
        position: absolute;
        bottom: -23px;
        left: -22px;
        right: -22px;
        height: 100px;
        background: url(https://g.smartcinemausa.com/images/6b1d8bc41e5c429ba63cc8ca662b7782-748-200.png) center no-repeat;
        background-size: contain;
      }
    }

    &_info {
      padding: 55px 20px 0;
      .film-title {
        @include font(20, 28);
        text-shadow: 0px 0px 22px rgba(0, 0, 0, 0.5);
        @include text-overflow;
      }
      .film-release {
        margin-top: 9px;
        @include font(13, 18);
        text-shadow: 0px 0px 22px rgba(0, 0, 0, 0.5);
        color: #EE202F;
      }
    }

  }

  &_button {
    margin-top: 30px;
    width: 330px;
    height: 44px;
    border-radius: 26px;
    background: linear-gradient(90deg, #FDF3BD 0%, #F3CE87 100%);
    color: #594B34;
    @include font(18, 25);
    font-weight: 600;
    @include flex($jus: center);
    cursor: pointer;
  }

  &_close {
    position: absolute;
    left: 50%;
    margin-left: -12px;
    bottom: 30px;
    width: 24px;
    height: 24px;
    background: url(https://g.smartcinemausa.com/images/a9442d40925b42cfac4c36848df92e55-48-48.png) center no-repeat;
    background-size: contain;
    cursor: pointer;
  }

  .slideDown-enter-active,
  .slideDown-leave-active {
    transition: all 0.6s ease;
  }
}
</style>
