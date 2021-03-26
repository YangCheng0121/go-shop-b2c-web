<template>
  <page-layout>
    <template #header>
      <van-nav-bar
        title="登录"
        left-arrow
        @click-left="back"
      />
    </template>
    <template #content>
      <div class="authorize-wrap">
        <div class="image-wrap">
          <van-image class="logo" :src="require('./images/logo.png')"></van-image>
          <van-image class="authorize" :src="require('./images/authorize.png')"></van-image>
          <van-image class="wechat" :src="require('./images/wechat.png')"></van-image>
        </div>
        <div class="info-wrap">
          <div class="info-title">
            确认授权就获得以下信息
          </div>
          <div class="info-content">
            · 个人信息
          </div>
        </div>
        <van-button class="authorize-btn" type="primary" @click="_authorizedLogin">
          确认授权
        </van-button>
      </div>
    </template>
  </page-layout>
</template>

<script type="es6">
import { PageLayout } from '@/layouts'
import { ERR_OK } from '@/api/config'
import { saveUser } from '@/cache/user'
import { mapGetters } from 'vuex'
import { authorizedLogin } from '@/api/wechat'
import { parseQueryString } from '@/utils/util'

export default {
  components: {
    PageLayout
  },
  name: 'Login',
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  data() {
    return {
      mobile: '',
      sms: '',
      isSend: false,
      time: 60
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    /**
     * 微信授权登录
     * @private
     */
    _authorizedLogin() {
      const { code } = parseQueryString(window.location.href)
      if (code) {
        authorizedLogin(code).then((res) => {
          if (res.err_code === ERR_OK) {
            const member = res.data
            saveUser(member)
            this.$store.dispatch('GetUser', member)
            this.$store.dispatch('GetOrderCount')
            this.$router.push({ name: 'Mine' })
          }
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
.authorize-wrap {
  padding-bottom: 10px;
  background: #fff;

  .image-wrap {
    height: 100px;
    line-height: 100px;
    text-align: center;

    .logo {
      display: inline-block;
      vertical-align: middle;
      width: 90px;
      height: 90px;
    }

    .wechat {
      display: inline-block;
      vertical-align: middle;
      width: 80px;
      height: 80px;
    }

    .authorize {
      display: inline-block;
      vertical-align: middle;
      margin: 0 15px;
      width: 35px;
      height: 35px;
    }
  }

  .info-wrap {
    padding: 0 20px;
    line-height: 30px;

    .info-title {
      font-size: 14px;
    }

    .info-content {
      font-size: 12px;
      color: #838383;
    }
  }

  .authorize-btn {
    display: block;
    margin: 10px auto;
    width: 80%;
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 14px;
    border-radius: 20px;
    color: #fff;
  }
}
</style>
