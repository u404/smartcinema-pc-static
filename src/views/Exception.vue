<template>
  <div class="page_view exception">
    <i class="exception_icon"></i>
    <div class="exception_message">{{$i18n._(e.message)}}</div>
    <HomeHoverButton />
  </div>
</template>

<script>
import { mapMutations } from "vuex"

import HomeHoverButton from "@/components/HomeHoverButton"

const Exception = {
  movie_unavailable_in_region: {
    message: "This movie is unavailable in your region."
  },
  activity_unavailable_in_region: {
    message: "This activity is unavailable in your region."
  }
}

export default {
  components: {
    HomeHoverButton
  },
  props: {
    type: String
  },
  data () {
    return {
    }
  },
  computed: {
    e () {
      return Exception[this.type] || Exception.default
    }
  },

  methods: {
    ...mapMutations(["setState"])
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
.exception {
  color: $color-dark;
  @include flex(column, center, center);
  &_icon {
    width: 230px;
    height: 164px;
    background: url(https://g.smartcinemausa.com/images/44f7cdb8af8844518225b1ea677e3284-460-328.png) center no-repeat;
    background-size: contain;
  }
  &_message {
    margin-top: 40px;
    @include font(24, 34);
  }
}

@include screen-mobile {
  .exception {
    &_icon {
      width: rem(115);
      height: rem(82);
    }
    &_message {
      margin-top: rem(12);
      @include font-m(12, 18);
    }
  }
}
</style>
