<template>
  <keep-alive :exclude="exclude">
    <router-view/>
  </keep-alive>
</template>

<script type="es6">
import routes from '@/config/router.config'

export default {
  name: 'App',
  watch: {
    $route() {
      this.directRightUrl()
    }
  },
  data() {
    return {
      exclude: []
    }
  },
  mounted() {
    this.exclude = this.getExclude()
  },
  methods: {
    directRightUrl() {
      // eslint-disable-next-line prefer-const
      let { href, protocol, host, pathname, search, hash } = window.location
      search = search || '?'
      const newHref = `${protocol}//${host}${pathname}${search}${hash}`
      if (newHref !== href) {
        window.location.replace(newHref)
      }
    },
    getExclude() {
      return routes.map((item) => {
        if (!item.keepAlive) {
          return item.name
        }
      }).filter(item => item)
    }
  }
}
</script>

<style lang="less">
@import 'base';

</style>
