<template>
  <a class="home-hover-button" href="#/home" @click="$emit('click')"></a>
</template>

<script>
export default {
  mounted () {
    document.body.append(this.$el)
  },
  beforeDestroy () {
    this.$el.remove()
  }
}
</script>

<style lang="scss" scoped>
.home-hover-button {
  position: fixed;
  right: 0;
  top: 50%;
  margin-top: -20px;
  width: 40px;
  height: 40px;
  border-radius: 6px 0px 0px 6px;
  background: rgba(0, 0, 0, 0.35) url(https://g.smartcinemausa.com/images/2c343ac3bc0045be8bd04d1d9565edc0-40-40.png) center no-repeat;
  background-size: 20px;
}
</style>
