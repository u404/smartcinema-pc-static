<template>
  <ul class="film-list" :class="type">
    <li class="film" v-for="(film, i) in data" :key="i" @click="$emit('filmclick', film)">
      <!-- <div class="film_image film_image--vertical" v-image="film.filmImgPath"></div> -->
      <div class="film_image" v-image="film.filmHeadImg"></div>
      <!-- <div class="film_infos">
        <div class="film_infos_name">{{film.filmRecommend}}</div>
      </div> -->
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: "col-5"
    },
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {

    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.film-list {
  @include flex($flow: row wrap, $jus: flex-start, $ali: flex-start);
  .film {
    flex: 0 0 auto;
    position: relative;
    cursor: pointer;
    transition: all ease 0.3s;

    @include font(20, 28);
    font-weight: 500;
    text-align: center;
    color: #ffffff;

    &_image {
      background: none center no-repeat;
      background-size: 100% 100%;
      border-radius: 12px;
      position: relative;
      &:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: none center no-repeat;
        background-size: contain;
        opacity: 0;
        transition: all ease 0.3s;
      }
    }
    &_infos {
      @include flex($jus: center);
      height: 60px;
      margin-bottom: -20px;
      &_name {
        @include text-line-clamp(2);
      }
    }

    &:hover {
      transform: translateZ(0) scale(1.08);
      .film_image {
        &:before {
          opacity: 1;
        }
      }
    }
  }

  &.col-3 {
    .film {
      margin-top: 42px;
      margin-left: 42px;
      width: 532px;
      &_image {
        height: 300px;
        &:before {
          width: 547px;
          height: 315px;
          background-image: url(https://g.smartcinemausa.com/images/c79c8c9632b34be9ad0af0e2ea5945db-1094-630.png);
        }
        &--vertical {
          display: none;
        }
        &--horizontal {
          display: block;
        }
      }
      &:nth-child(-n + 3) {
        margin-top: 0;
      }
      &:nth-child(3n + 1) {
        margin-left: 0;
      }
    }
  }

  &.col-5 {
    .film {
      margin-top: 40px;
      margin-left: 40px;
      width: 304px;
      &_image {
        height: 406px;
        &:before {
          width: 321px;
          height: 422px;
          background-image: url(https://g.smartcinemausa.com/images/88f2849d78ba4b4b969bac8b8b2d51f3-642-844.png);
        }
        &--vertical {
          display: block;
        }
        &--horizontal {
          display: none;
        }
      }
      &:nth-child(-n + 5) {
        margin-top: 0;
      }
      &:nth-child(5n + 1) {
        margin-left: 0;
      }
    }

  }
}

@include screen-small {
  .film-list {

    .film {
      &_infos {
        &_name {
          @include font(16, 24);
        }
      }
    }

    &.col-3 {
      .film {
        margin-top: 30px;
        margin-left: 30px;
        width: 380px;
        &_image {
          height: 214px;
          &:before {
            width: 396px;
            height: 230px;
            background-image: url(https://g.smartcinemausa.com/images/34bfee95fb0649e58388835c4044fca4-792-460.png);
          }
        }
      }
    }

    &.col-5 {
      .film {
        margin-top: 30px;
        margin-left: 30px;
        width: 216px;
        &_image {
          height: 288px;
          &:before {
            width: 233px;
            height: 304px;
            background-image: url(https://g.smartcinemausa.com/images/d5b0946901b841f5a04bdac8d1a92baa-466-608.png);
          }
          // &:before {
          //   transform: translate(-50%, -50%) scale(0.735);
          // }
        }
      }

    }
  }
}

@include screen-mobile {
  .film-list {
    justify-content: space-between;
    .film {
      overflow: hidden;
      position: relative;
      border-radius: rem(4);
      background: #1e1e1e;
      &_image {
        border-radius: 0;
        &:before {
          display: none;
        }
      }
      &:hover {
        transform: none;
      }

      &_infos {
        height: rem(64);
        margin-bottom: 0;

        &_name {
          padding: 0 rem(5);
          @include font-m(16, 22);
          color: #d8d8d8;
          display: block;
          @include text-line-clamp(2);
        }
      }

    }

    &.col-3 {
      .film {
        margin-top: rem(15);
        margin-left: 0;
        width: rem(162);
        border-radius: rem(2);
        &:nth-child(-n + 3) {
          margin-top: rem(15);
        }
        &:nth-child(3n + 1) {
          margin-left: 0;
        }
        &:first-child {
          margin-left: 0;
        }
        &_image {
          height: rem(97);
          &:before {
            display: none;
          }
          &--vertical {
            display: block;
          }
          &--horizontal {
            display: none;
          }
        }

      }
    }

    &.col-5 {
      .film {
        margin-top: rem(15);
        margin-left: 0;
        width: rem(168);
        &:nth-child(5n + 1) {
          margin-left: 0;
        }
        &:first-child {
          margin-left: 0;
        }
        &_image {
          height: rem(232);
          &:before {
            display: none;
          }
          &--vertical {
            display: block;
          }
          &--horizontal {
            display: none;
          }
        }

      }
    }
  }

}
</style>
