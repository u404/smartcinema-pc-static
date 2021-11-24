<template>
  <div class="film-drawer">
    <div class="film-drawer_title" v-show="title">{{title}}</div>
    <div class="film-drawer_body">
      <FilmList :data="data" :type="type" @filmclick="e => $emit('filmclick', e)" />
    </div>
  </div>
</template>

<script>
import FilmList from "./FilmList"
export default {
  components: {
    FilmList
  },
  props: {
    title: String,
    type: String,
    data: Array
  }
}
</script>

<style lang="scss" scoped>
.film-drawer {
  &_title {
    @include font(24, 33);
    font-weight: 500;
    color: #ffffff;
    margin-bottom: 16px;
  }
}
@include screen-mobile {
  .film-drawer {
    &_title {
      padding: 0 $page-margin-mobile;
      @include font-m(16, 24);
      margin-bottom: rem(12);
    }
    &_body {
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      .film-list {
        padding: 0 $page-margin-mobile;
        float: left;
        @include flex($jus: flex-start);
      }
    }
  }

}
</style>
