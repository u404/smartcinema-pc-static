<template>
  <div class="error-page">
    <i class="error-icon"></i>
    <div class="error-detail">
      <div class="error-title">The page has expired</div>
      <div class="error-desc">Please go back to Vizio to make payment again</div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import "../styles/mixins.scss";
.error-page {
  width: 100%;
  height: 100vh;
  padding-bottom: 10vh;
  background: #121212;

  @include flex($jus: center);

  .error-icon {
    width: 290px;
    height: 290px;
    background: url(https://g.smartcinemausa.com/images/c1287c1ec92146b28392459a6e2235a2-580-580.png) center no-repeat;
    background-size: contain;
  }

  .error-detail {
    margin-left: 65px;
  }
  .error-title {
    @include font(46, 69);
    color: $color-lightest;
  }
  .error-desc {
    margin-top: 20px;
    @include font(36, 54);
  }
}

@media screen and (max-width: 1280px) {
  .error-page {
    .error-icon {
      width: 200px;
      height: 200px;
    }

    .error-detail {
      margin-left: 45px;
    }
    .error-title {
      @include font(32, 54);
      color: $color-lightest;
    }
    .error-desc {
      margin-top: 20px;
      @include font(28, 40);
    }
  }

}

@media screen and (max-width: 767px) {
  .error-page {
    background: $bg-body-m;
    @include flex(column, center, center);
    .error-icon {
      width: rem(166);
      height: rem(166);
      background-image: url(https://g.smartcinemausa.com/images/1c83c277edc046449a2ae9f0a10081d1-332-332.png);
    }
    .error-detail {
      margin-top: rem(16);
      margin-left: 0;
      text-align: center;
    }
    .error-title {
      @include font-m(16, 24);
      color: #999999;
    }
    .error-desc {
      margin-top: rem(10);
      @include font(14, 20);
      color: #cccccc;
    }
  }
}
</style>
