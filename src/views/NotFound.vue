<template>
  <div class="page_view notFound">
    <i class="notFound_icon"></i>
    <div class="notFound_message">{{$i18n._("Sorry, We couldn't find that page !")}}</div>
    <div class="notFound_tips">{{$i18n._("Maybe you can find what you need here?")}}</div>
    <div class="notFound_btn">
      <button class="back-btn" @click="back">{{$i18n._("Go Back")}}</button>
      <div v-image="`https://g.smartcinemausa.com/images/b4edd4ccb689429f9880d28dd75eac58-190-180.png`"></div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex"

export default {
  data () {
    return {
    }
  },

  methods: {
    ...mapMutations(["setState"]),
    back () {
      if (window.history.length) {
        this.$router.back()
      } else {
        this.$router.push({ name: "home" })
      }
    }
  },

  beforeMount () {
    this.setState({ bgDisabled: true })
  },
  mounted () {
  },
  destroyed () {
    this.setState({ bgDisabled: false })
  }

}
</script>

<style lang="scss" scoped>
.notFound {
  color: $color-dark;
  @include flex(column, center, center);
  &_icon {
    width: 178px;
    height: 151px;
    background: url(https://g.smartcinemausa.com/images/ca9bec4c3ce04623847627b0720d61e9-428-364.png) center no-repeat;
    background-size: contain;
  }
  &_message {
    color: #E0E0E0;
    margin-top: 40px;
    @include font(26, 34);
  }
  &_tips{
    position: relative;
    display: inline-block;
    margin: 15px auto 0;
    color: #E0E0E0;
    @include font(17, 21);
    &::after{
      display: block;
      position: absolute;
      bottom: -49px;
      right: -15px;
      content: "";
      width: 98px;
      height: 61px;
      background: url(https://g.smartcinemausa.com/images/cd4138b1563144f8a69ec11eb36dcaa0-312-196.png) 0 0 no-repeat;
      background-size: 98px 61px;
    }
  }
  &_btn{
    margin-top: 15px;
    .back-btn{
      @include font(15, 15);
      font-weight: bold;
      color: #000000;
      padding: 10px 22px;
      background: linear-gradient(135deg, #FDF2BC 0%, #F4D18D 100%);
      border-radius: 22px;
      border: none;
    }
  }
}

@include screen-mobile {
  .notFound {
    &_icon {
      width: rem(107);
      height: rem(91);
    }
    &_message {
      margin-top: rem(12);
      color: #E0E0E0;
      font-weight: bold;
      @include font-m(16, 20);
    }
    &_tips{
      position: relative;
      display: inline-block;
      margin: rem(6) auto 0;
      color: #E0E0E0;
      @include font-m(10, 17);
      &::after{
        display: block;
        position: absolute;
        bottom: rem(-40);
        right: rem(-10);
        content: "";
        width: rem(48);
        height: rem(45);
        background: url(https://g.smartcinemausa.com/images/654928e13a6b4d30b2da15b26566b42a-190-180.png) 0 0 no-repeat;
        background-size: contain;
      }
    }
    &_btn{
      margin-top: rem(15);
      .back-btn{
        @include font-m(12, 18);
        font-weight: bold;
        color: #000000;
        padding: rem(8) rem(24);
        background: linear-gradient(135deg, #FDF2BC 0%, #F4D18D 100%);
        border-radius: rem(18);
        border: none;
      }
    }
  }
}
</style>
