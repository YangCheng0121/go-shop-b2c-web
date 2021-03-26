<template>
  <page-layout>
    <template #header>
      <van-nav-bar
        title="添加地址"
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
          :value="address.area_name"
          label="地区选择"
          placeholder="点击选择省市区"
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
        </div>
      </van-form>
    </template>
  </page-layout>
</template>

<script type="es6">
import { PageLayout } from '@/layouts'
import { addAddress } from '@/api/address'
import { ERR_OK } from '@/api/config'
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
  methods: {
    back() {
      this.$router.back()
    },
    onSubmit() {
      this._addAddress()
    },
    /**
     * 添加地址
     * @private
     */
    _addAddress() {
      const address = this.address
      address.is_default = Number(address.is_default)
      addAddress(JSON.stringify(address)).then((res) => {
        if (res.err_code === ERR_OK) {
          this.$store.dispatch('SetAddressIsUpdate', true)
          this.$router.back()
        }
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
