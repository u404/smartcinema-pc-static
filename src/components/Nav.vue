<template>
  <div class="nav">
    <!-- <router-link class="menu pos-active-reset" v-for="(nav, i) in navRoutes" v-show="nav.display ? nav.display($store) : true" :key="i" :to="{ path: nav.path}">{{nav.title}}</router-link> -->
  </div>
</template>

<script>
import { navRoutes } from "../router"
export default {
  data () {
    return {
      navRoutes: navRoutes.filter(r => r.title)
    }
  }
}
</script>

<style lang="scss" scoped>
.nav {
  @include flex($jus: flex-start);
  .menu-list {

  }
  a.menu {
    margin-left: 30px;
    @include font(18, 25);
    font-weight: 500;
    color: $color-normal;
    &:first-child {
      margin-left: 0;
    }

    &.router-link-active {
      font-weight: bold;
      color: $color-dark;
    }
  }
}
</style>
