<template>
  <div class="center-content">
    <div class="center-content-main">
      <slot></slot>
    </div>
    <div class="center-content-bottom">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.center-content {
  flex: 1 1 auto;
  @include flex(column nowrap, center, center);

  padding: 50px 0 100px;
  &-main {
    width: 503px;
    background: $bg-light;
    border-radius: $border-radius-default;
    overflow: hidden;
  }
  &-bottom {
    width: 503px;
  }
}

@include screen-mobile {
  .center-content {
    padding: rem(30) rem(15);

    &-main {
      width: 100%;
    }
    &-bottom {
      width: 100%;
    }
  }
}
</style>
