<template>
  <div class="follow-us">
    <!-- <div class="follow-us_tips">Follow Smart Cinema USA</div> -->
    <div class="follow-us_items">
      <a target="_blank" :href="item.link" v-for="(item, i) in SITE_CONFIG.followUs" :key="i">
        <img :src="item.icon" />
      </a>
    </div>
  </div>
</template>

<script>
import { SITE_CONFIG } from "@/define"
export default {
  data () {
    return {
      SITE_CONFIG
    }
  }
}
</script>

<style lang="scss">
.follow-us {
  text-align: center;
  // width: 142px;
  &_tips {
    @include font(14, 14);
  }
  &_items {
    margin: 24px 0 0;
    @include flex($jus: space-between);
    a:nth-child(n + 2) {
      margin-left: 20px;
    }
    img {
      width: 36px;
      height: 36px;
      object-fit: contain;
      display: block;
    }
  }
}

@include screen-mobile {
  .follow-us {
    &_tips {
      color: #FFFFFF;
      @include font(11, 11);
    }
    &_items {
      margin: rem(9) 0 0;
      @include flex($jus: center);
      // a {
      //   margin: 0 rem(10);
      // }
      a:nth-child(n + 2) {
        margin-left: rem(20);
      }
      img {
        width: rem(28);
        height: rem(28);
      }
    }
  }
}
</style>
