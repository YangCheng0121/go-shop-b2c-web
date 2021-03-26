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
      <van-form @submit="onSubmit">
        <van-field
          v-model="mobile"
          type="number"
          name="mobile"
          label="手机号码"
          placeholder="手机号码"
          :rules="[{ required: true, message: '请填写手机号码' }]"
        />
        <van-field
          v-model="sms"
          name="sms"
          label="验证码"
          placeholder="验证码"
          :rules="[{ required: true, message: '请填写验证码' }]">
          <template #button>
            <van-button
              size="small"
              native-type="button"
              type="info"
              :disabled="isSend"
              @click="_getSms">
              {{ isSend ? `${time}s` : '发送验证码' }}
            </van-button>
          </template>
        </van-field>
        <div style="margin: 16px">
          <van-button
            round
            block
            type="info"
            native-type="submit"
            class="login-footer">
            登录
          </van-button>
        </div>
      </van-form>
    </template>
  </page-layout>
</template>

<script type="es6">
import { PageLayout } from '@/layouts'
import { getSms } from '@/api/sms'
import { ERR_OK } from '@/api/config'
import { login } from '@/api/user'
import { saveUser } from '@/cache/user'

export default {
  components: {
    PageLayout
  },
  name: 'TestLogin',
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
    onSubmit(values) {
      this._login()
    },
    /**
     * 获取短信
     * @private
     */
    _getSms() {
      if (!this.mobile) {
        this.$toast('请填写手机号码')
        return
      }

      const mobile = this.mobile
      getSms(mobile).then((res) => {
        if (res.err_code === ERR_OK) {
          this.$toast(res.data)
          this.timeDown()
        }
      })
    },
    /**
     * 倒计时
     */
    timeDown() {
      this.clearTimer()
      this.isSend = true

      let time = 60
      this.time = 60
      this.timer = setInterval(() => {
        time--
        this.time = time
        if (time === 0) {
          this.clearTimer()
          this.isSend = false
        }
      }, 1000)
    },
    clearTimer() {
      clearInterval(this.timer)
      this.timer = null
    },
    /**
     * 验证码登录
     * @private
     */
    _login() {
      const mobile = this.mobile
      const sms = this.sms
      login({
        mobile,
        sms
      }).then((res) => {
        if (res.err_code === ERR_OK) {
          const member = res.data
          saveUser(member)
          this.$store.dispatch('GetUser', member)
          this.$router.back()
        } else {
          this.$toast(res.data)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
