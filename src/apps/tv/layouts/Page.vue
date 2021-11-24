<template>
  <div class="page">
    <div class="page-header">
      <div class="header-content">
        <div class="logo"></div>
        <div></div>
      </div>
    </div>
    <slot class="page-main"></slot>
    <div class="page-footer">
      <div class="footer-follow-us">
        <div class="tips">Follow Smart Cinema USA</div>
        <div class="items">
          <a target="_blank" href="https://www.facebook.com/smartcinemausaca/">
            <img alt="Smart Cinema USA Facebook" src="https://static.wixstatic.com/media/23fd2a2be53141ed810f4d3dcdcd01fa.png/v1/fill/w_56,h_56,al_c,usm_0.66_1.00_0.01/23fd2a2be53141ed810f4d3dcdcd01fa.png" />
          </a>
          <a target="_blank" href="https://www.instagram.com/smartcinemaus/">
            <img alt="White Instagram Icon" src="https://static.wixstatic.com/media/81af6121f84c41a5b4391d7d37fce12a.png/v1/fill/w_56,h_56,al_c,usm_0.66_1.00_0.01/81af6121f84c41a5b4391d7d37fce12a.png" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },

  computed: {
  },

  methods: {

  },

  beforeMount () {
  },

  mounted () {
  }

}
</script>

<style lang="scss">
@import "../styles/mixins.scss";
body {
}
.page {
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  position: relative;
  @include flex(column, space-between, stretch);

  &-header {
    position: sticky;
    top: 0;
    background: $bg-body;
    z-index: 10;
    .header-content {
      margin: 0 auto;
      width: 100%;
      padding: 0 80px;
      height: 80px;
      @include flex;
      .logo {
        width: 194px;
        height: 24px;
        background: url(https://g.smartcinemausa.com/images/15c3b1938cc1453daea928797e41331a-388-52.png) center no-repeat;
        background-size: contain;
      }
    }

  }
  &-main {
    flex: 1 0 auto;
  }

  &-footer {
    flex: 0 0 auto;
    .footer-follow-us {
      padding-top: 70px;
      text-align: center;
      .tips {
        @include font(16, 22);
      }
      .items {
        margin: 23px 0 30px;
        @include flex($jus: center);
        a:nth-child(n + 1) {
          margin: 0 10px;
        }
        img {
          width: 56px;
          height: 56px;
          object-fit: cover;
          display: block;
        }
      }
    }
  }
}

@media screen and (max-width: 767px) {
  body {
    background: $bg-body-m;
    color: $color-normal-m;
  }
  .page {
    &-header { display: none; }
    &-footer { display: none; }
  }

  .h5-alert {
    &-body {
      padding: 0 rem(30);
    }
    &-msg {
      padding: rem(15) rem(20);
      @include font(16, 24);
    }
  }
}
</style>
