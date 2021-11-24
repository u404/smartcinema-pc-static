<template>
  <div class="download-icon">
    <!-- <div class="follow-us_tips">Follow Smart Cinema USA</div> -->
    <div class="download-icon_items">
      <a target="_blank" href="https://play.google.com/store/apps/details?id=us.android.mingzhi.motv">
        <img alt="Smart Cinema USA GooglePlay" src="https://g.smartcinemausa.com/images/51df07a8d9f145809d0f2a8be0285750-202-64.png" />
      </a>
      <a target="_blank" :href="weChat ? `https://scdeeplink.smartcinemausa.com/`:`https://apps.apple.com/us/app/smart-cinema-usa/id1471108952`">
        <img alt="Smart Cinema USA AppStore" src="https://g.smartcinemausa.com/images/7da25e6e762b49f089907950700be59f-202-64.png" />
      </a>
      <a target="_blank">
        <img alt="Smart Cinema USA Vizio" src="https://g.smartcinemausa.com/images/9d0e42ce174241a5a6c6ab350e1197be-202-64.png" />
      </a>
    </div>
  </div>
</template>
<script>
import env from "@sc/lib-env"
export default {
  data () {
    return {
      weChat: env.browser.WeChat
    }
  }
}
</script>
<style lang="scss">
.download-icon {
  text-align: center;
  width: 323px;
  &_items {
    margin: 24px 0 0;
    @include flex($jus: space-between);
    a:nth-child(n + 1) {
      // margin: 0 20px;
    }
    img {
      width: 101px;
      height: 32px;
      object-fit: contain;
      display: block;
    }
  }
}

@include screen-mobile {
  .download-icon {
    &_items {
      margin: rem(22) auto rem(12);
      @include flex($jus: center);
      a {
        margin: 0 rem(4);
      }
      img {
        width: rem(82);
        height: rem(26);
      }
    }
  }
}
</style>
