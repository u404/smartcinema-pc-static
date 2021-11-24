<template>
  <div class="dropdown-menu" :class="{ 'dropdown-menu-active': active }" @mouseleave="active = fale">
    <div class="main-button" @mouseover="active = true">
      <slot></slot>
    </div>
    <transition name="dropdownToggle">
      <div class="child-menu-wrap" v-show="active">
        <slot name="childMenu" :close="()=> (active = false)">
        </slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: false
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-menu {
  position: relative;
  .main-button {
    cursor: pointer;
  }
  .child-menu-wrap {
    position: absolute;
    top: 100%;
    margin-top: 10px;
    right: 0;
    background: $bg-light;
    border-radius: $border-radius-default;
    box-shadow: 0 5px 5px 5px rgba(0,0,0,0.1);
    &:before {
      content: "";
      position: absolute;
      top: -10px;
      right: 15px;
      border: 5px solid transparent;
      border-bottom: 5px solid $bg-light;
    }
    &:after {
      content: "";
      position: absolute;
      top: -20px;
      left: 0;
      width: 100%;
      height: 20px;
    }
  }
}
</style>
