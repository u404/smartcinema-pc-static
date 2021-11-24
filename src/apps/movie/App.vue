<template>
  <div class="page">
    <div class="page-header">
      <div class="main-wrap">
        <i class="logo"></i>
      </div>
    </div>
    <div class="page-main">
      <Detail class="main-wrap" />
    </div>
  </div>
</template>

<script>
import Detail from "./views/Detail"

export default {
  components: {
    Detail
  },
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
@import "styles/mixins.scss";
body {
  background: $bg-body;
}
.page {
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  position: relative;

  &-header {
    .main-wrap {
      padding: 30px 0;
    }
    .logo {
      display: block;
      width: 343px;
      height: 32px;
      background: url(https://g.smartcinemausa.com/images/6a1cfabb69a442b48949690c8592ad58-686-86.png) left center no-repeat;
      background-size: contain;
    }

  }
}

.main-wrap {
  margin: 0 auto;
  width: 1660px;
}

@media screen and (max-width: 1699px) {
  .main-wrap {
    width: 1200px;
  }
}

@media screen and (max-width: 767px) {
  .page {
    &-header { display: none; }
  }

  .main-wrap {
    width: 100%;
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
