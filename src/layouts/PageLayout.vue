<template>
  <div class="page-layout">
    <slot name="header"></slot>
    <div id="wrapper" class="page-layout-wrapper" :style="{'padding-bottom': beforeContent + 'px'}">
      <slot name="before-content"></slot>
      <cube-scroll
        ref="scroll"
        class="page-layout-content"
        :data="data"
        :options="scrollOptions"
        @pulling-up="pullingUp"
        @pulling-down="pullingDown">
        <slot name="content"></slot>
      </cube-scroll>
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script type="es6">
export default {
  name: 'PageLayout',
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    beforeContent: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    },
    pullDownRefresh: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    scrollOptions() {
      return Object.assign({}, this.options, {
        pullUpLoad: this.pullUpLoad,
        pullDownRefresh: this.pullDownRefresh
      })
    }
  },
  data() {
    return {
      options: {
        scrollbar: true
      }
    }
  },
  activated() {
    this.$refs.scroll.refresh()
  },
  methods: {
    /**
     * 派发上拉加载
     */
    pullingUp() {
      if (this.scrollOptions.pullUpLoad) {
        this.$emit('pullingUp')
      }
    },
    /**
     * 派发下拉刷新
     */
    pullingDown() {
      if (this.scrollOptions.pullDownRefresh) {
        this.$emit('pullingDown')
      }
    },
    /**
     *
     */
    forceUpdate() {
      this.$refs.scroll.forceUpdate()
    }
  }
}
</script>

<style scoped lang="less">
@import '../utils/css/index';

.page-layout {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: @s-zIndex;
  background: #fff;

  &-wrapper {
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 0;

    .page-layout-content {
      background: @background;
    }
  }
}

</style>
