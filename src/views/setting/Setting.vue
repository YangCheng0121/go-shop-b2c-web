<template>
  <page-layout v-if="user">
    <template #header>
      <van-nav-bar
        title="设置"
        left-arrow
        @click-left="back"
      />
    </template>
    <template #content>
      <van-cell-group>
        <van-cell :value="user.name" center>
          <template #title>
            <van-image
              round
              width="40px"
              height="40px"
              :src="user.avatar"
            />
          </template>
        </van-cell>
        <van-cell title="我的积分" :value="user.point"/>
      </van-cell-group>
    </template>
    <template #footer>
      <van-button class="setting-footer box-shadow" @click="logout">退出登录</van-button>
    </template>
  </page-layout>
</template>

<script type="es6">
import { PageLayout } from '@/layouts'
import { Dialog } from 'vant'
import { logout } from '@/api/user'
import { ERR_OK } from '@/api/config'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageLayout
  },
  name: 'Setting',
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  methods: {
    back() {
      this.$router.back()
    },
    logout() {
      Dialog.confirm({
        title: '提示',
        message: '确定退出登录?'
      })
        .then(() => {
          // on confirm
          logout().then((res) => {
            if (res.err_code === ERR_OK) {
              this.$store.dispatch('Logout')
              this.$router.back()
            }
          })
        })
        .catch(() => {
          // on cancel
        })
    }
  }
}
</script>

<style scoped lang="less">
.setting-footer {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background: #fff;
}
</style>
