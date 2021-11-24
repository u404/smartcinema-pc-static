<template>
  <div class="h5-loading" v-show="show">
    <div class="loading-main" :class="{ 'has-tips': msg }">
      <i class="loading-icon"></i>
      <div class="loading-tips">{{msg}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "h5-loading",
  props: {
    msg: {
      type: String,
      default: ""
    },
    show: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss">
.h5-loading {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background: rgba(0,0,0,0.1);
  @include flex($jus: center);
  .loading-main {
    padding: 28px;
    background: none;
    .loading-icon {
      display: block;
      width: 170px;
      height: 170px;
      background: url(https://g.smartcinemausa.com/images/8c985d11dcc247878f342429177c1e8e-340-340.gif)
        center no-repeat;
      background-size: contain;
      animation: none;
    }
    &.has-tips {
      .loading-tips {
        margin-top: 10px;
        display: block;
        text-align: center;
        font-size: 14px;
        color: #fff;
      }
    }

  }
}

@include screen-mobile {
  .h5-loading {
    .loading-main {
      .loading-icon {
        width: rem(120);
        height: rem(120);
      }
    }
  }
}
</style>
