<template>
  <page-layout>
    <template #header>
      <van-nav-bar
        title="编辑地址"
        left-arrow
        @click-left="back"
      />
    </template>
    <template #content>
      <van-form @submit="onSubmit" class="form">
        <van-field
          v-model="address.consignee"
          name="consignee"
          label="收货人"
          placeholder="收货人"
          :rules="[{ required: true, message: '请填写收货人' }]"
        />
        <van-field
          v-model="address.phone"
          name="phone"
          type="number"
          label="联系方式"
          placeholder="联系方式"
          :rules="[{ required: true, message: '请填写联系方式' }]"
        />
        <van-field
          readonly
          clickable
          name="area"
          placeholder="点击选择省市区"
          label="地区选择"
          is-link
          :value="address.area_name"
          :rules="[{ required: true, message: '请选择地区' }]"
          @click="showCascadePicker"
        />
        <van-field
          v-model="address.address"
          name="address"
          label="详细地址"
          placeholder="详细地址"
          clearable
          :rules="[{ required: true, message: '请填写联系方式' }]"
        />
        <van-cell title="设置默认地址">
          <template #default>
            <van-switch v-model="address.is_default" size="20"></van-switch>
          </template>
        </van-cell>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            提交
          </van-button>
          <van-button
            round
            block
            native-type="button"
            type="default"
            style="margin-top: 10px"
            @click="_deleteAddress">
            删除
          </van-button>
        </div>
      </van-form>
    </template>
  </page-layout>
</template>

<script type="es6">
import { PageLayout } from '@/layouts'
import { deleteAddress, getAddress, updateAddress } from '@/api/address'
import { ERR_OK } from '@/api/config'
import { Dialog } from 'vant'
import areaMixin from './area'

export default {
  components: {
    PageLayout
  },
  name: 'AddressEdit',
  mixins: [areaMixin],
  data() {
    return {
      address: {
        consignee: '',
        phone: '',
        area_name: '',
        area_id: null,
        address: ''
      },
      showArea: false
    }
  },
  mounted() {
    this._getAddress()
  },
  methods: {
    back() {
      this.$router.back()
    },
    onSubmit() {
      this._updateAddress()
    },
    /**
     * 获取地址
     * @private
     */
    _getAddress() {
      const id = this.$route.params.id
      getAddress(id).then((res) => {
        if (res.err_code === ERR_OK) {
          const data = res.data
          data.is_default = Boolean(data.is_default)
          this.address = data
        }
      })
    },
    /**
     * 更新地址
     * @private
     */
    _updateAddress() {
      const address = this.address
      address.is_default = Number(address.is_default)
      updateAddress(JSON.stringify(address)).then((res) => {
        if (res.err_code === ERR_OK) {
          this.$store.dispatch('SetAddressIsUpdate', true)
          this.$router.back()
        }
      })
    },
    _deleteAddress() {
      Dialog.confirm({
        title: '提示',
        message: '确认删除该地址?'
      })
        .then(() => {
          const ids = this.address.id
          deleteAddress(ids).then((res) => {
            if (res.err_code === ERR_OK) {
              this.$store.dispatch('SetAddressIsUpdate', true)
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
.form {
  padding: 10px;
}
</style>
