<template>
  <page-layout
    :pullUpLoad="pullUpLoad"
    :before-content="60">
    <template #header>
      <van-nav-bar
        title="收货地址"
        left-arrow
        @click-left="back"
      />
    </template>
    <template #before-content>
      <empty description="暂无地址，请添加" v-if="!isEmpty"/>
    </template>
    <template #content>
      <div class="address-list" v-if="isEmpty">
        <van-cell
          v-for="item in addressPageList.list"
          :key="item.id"
          @click="selectReceiver(item)"
          class="address-list-cell">
          <div class="address-list__name">
            {{ item.consignee }} {{ item.phone }}
            <van-tag
              v-if="item.is_default"
              type="danger"
              round
              class="address-list__name__tag">
              默认
            </van-tag>
          </div>
          <div class="address-list__address">
            {{ item.area_name }} {{ item.address }}
          </div>
          <!-- 使用 right-icon 插槽来自定义右侧图标 -->
          <template #right-icon>
            <div
              class="address-list__right-icon van-hairline--top"
              @click="toEditPage(item.id)">
              <van-icon name="edit" size="18"/>
            </div>
          </template>
        </van-cell>
      </div>
    </template>
    <template #footer>
      <div class="address-list__footer">
        <van-button type="danger" round block @click="toAddPage">新增地址</van-button>
      </div>
    </template>
  </page-layout>
</template>

<script type="es6">
import { PageLayout } from '@/layouts'
import { getAddressList } from '@/api/address'
import { ERR_OK } from '@/api/config'
import { Empty } from '@/components'
import { mapGetters } from 'vuex'

export default {
  components: {
    PageLayout,
    Empty
  },
  name: 'AddressList',
  computed: {
    isEmpty() {
      return this.addressPageList.list && this.addressPageList.list.length
    },
    ...mapGetters([
      'isAddressUpdate'
    ])
  },
  watch: {
    isAddressUpdate(newVal) {
      if (newVal) {
        this._getAddressList()
      }
    }
  },
  data() {
    return {
      addressPageList: {},
      pullUpLoad: true
    }
  },
  mounted() {
    this._getAddressList()
  },
  methods: {
    back() {
      this.$router.back()
    },
    /**
     * 跳转地址编辑
     */
    toEditPage(id) {
      this.$router.push({
        name: 'AddressEdit',
        params: { id: id }
      })
    },
    /**
     * 跳转添加地址
     */
    toAddPage() {
      this.$router.push({ name: 'AddressAdd' })
    },
    /**
     * 获取地址列表
     * @param pageNumber
     * @param pageSize
     * @private
     */
    _getAddressList(pageNumber = 1, pageSize = 20) {
      const sortby = 'LastUpdatedDate'
      const order = 'desc'
      getAddressList({
        pageNumber,
        pageSize,
        sortby,
        order
      }).then((res) => {
        if (res.err_code === ERR_OK) {
          const data = res.data
          this.pullUpLoad = !data.is_last
          if (pageNumber > 1) {
            this.addressPageList.list = this.addressPageList.list.concat(data.list)
            this.addressPageList.is_last = data.is_last
            this.addressPageList.page_number = data.page_number
          } else {
            this.addressPageList = data
          }
          this.$store.dispatch('SetAddressIsUpdate', false)
        }
      })
    },
    /**
     * 选择地址
     * @param receiver
     */
    selectReceiver(receiver) {
      const { from } = this.$route.query
      if (from === 'confirm-order') {
        this.$store.dispatch('SetCheckoutOrderReceiver', receiver).then(() => {
          this.back()
        })
      }
    }
  }
}
</script>

<style scoped lang="less">
@import "../../utils/css/index";

.address-list {
  padding: 10px;
  background: #fff;

  &__name {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 16px;
    line-height: 22px;

    &__tag {
      margin-left: 8px;
    }
  }

  &__address {
    color: #666;
    font-size: 13px;
    line-height: 18px;
  }

  &__right-icon {
    display: flex;
    align-items: center;
    padding: 0 10px;

    .right-icon {
      vertical-align: middle;
    }
  }

  &__footer {
    position: fixed;
    right: 0;
    bottom: 0;
    padding: 10px;
    z-index: @m-zIndex;
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    background: #fff;
  }
}
</style>
