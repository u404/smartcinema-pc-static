<template>
  <div class="h5-alert" @click="close">
    <transition name="h5-fade" appear>
      <div class="h5-alert-mask" v-show="visible"></div>
    </transition>
    <transition name="h5-slideUp" appear>
      <div class="h5-alert-body" v-show="visible">
        <slot><div class="h5-alert-msg" role="alert">{{msg}}</div></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "h5-alert",
  props: {
  },

  data () {
    return {
      timer: null,
      visible: false,
      msg: ""
    }
  },

  methods: {
    show (msg, { autoClose = 3000 }) {
      this.msg = msg
      this.timer && clearTimeout(this.timer)
      this.visible = true
      if (autoClose) {
        this.timer = setTimeout(() => this.close(), autoClose)
      }
    },
    close () {
      this.timer && clearTimeout(this.timer)
      this.timer = null
      this.visible = false
      this.$emit("close")
      console.log("close")
    }
  }

}
</script>

<style lang="scss">
.h5-alert {
  &-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
  }

  &-body {
    position: fixed;
    z-index: 2001;
    top: 50%;
    left: 0;
    width: 100%;
    width: 100%;
    @include flex($jus: center);
  }

  &-msg {
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    border-radius: 100px;
    box-shadow: 0 2px 10px 0.5px rgba(0, 0, 0, 0.1);
    line-height: 24px;
    font-size: 16px;
  }
}
</style>
