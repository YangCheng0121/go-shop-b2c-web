<template>
  <page-layout
    :pullUpLoad="pullUpLoad"
    @pulling-up="handlePullingUp">
    <template #header>
      <van-nav-bar
        title="优惠券"
        left-arrow
        @click-left="back"
      />
    </template>
    <template #content>
      <van-coupon-list
        :coupons="coupons"
        :chosen-coupon="chosenCoupon"
        :disabled-coupons="disabledCoupons"
        :show-close-button="false"
        @exchange="onExchange"
      />
    </template>
  </page-layout>
</template>

<script type="es6">
import { PageLayout } from '@/layouts'
import { exchangeCoupon, getCouponList } from '@/api/coupon'
import { ERR_OK } from '@/api/config'
import moment from 'moment'

export default {
  components: {
    PageLayout
  },
  name: 'Coupon',
  data() {
    return {
      chosenCoupon: -1,
      coupons: [],
      disabledCoupons: [],
      couponPageList: {},
      pullUpLoad: true
    }
  },
  mounted() {
    this._getCouponList({ IsUsed: '0' })
    this._getCouponList({ IsUsed: '1' })
  },
  methods: {
    back() {
      this.$router.back()
    },
    onExchange(code) {
      exchangeCoupon(code).then((res) => {
        if (res.err_code === ERR_OK) {
          this._getCouponList({ IsUsed: '0' })
        }
      })
    },
    handlePullingUp() {
      if (this.couponPageList.is_last) {
        return
      }
      const pageNumber = this.couponPageList.pageNumber + 1
      this._getCouponList({ IsUsed: '0' }, pageNumber)
    },
    /**
     * 获取优惠券列表
     * @param pageNumber
     * @param pageSize
     * @param query
     * @private
     */
    _getCouponList(query, pageNumber = 1, pageSize = 20) {
      const order = 'desc'
      const sortby = 'CreationDate'
      getCouponList({
        pageNumber,
        pageSize,
        order,
        sortby,
        query
      }).then((res) => {
        if (res.err_code === ERR_OK) {
          const data = res.data
          this.couponPageList = res.data
          this.pullUpLoad = !res.data.is_last
          if (pageNumber > 1) {
            this.couponPageList.is_last = data.is_last
            this.couponPageList.page_number = data.page_number
          }
          if (data.list) {
            if (query.IsUsed === '0') {
              data.list.forEach(item => {
                const coupon = {
                  available: 1,
                  condition: item.coupon.condition,
                  reason: '',
                  value: item.coupon.value * 100,
                  name: item.coupon.name,
                  startAt: moment(item.coupon.begin_date).unix(),
                  endAt: moment(item.coupon.end_date).unix(),
                  valueDesc: item.value,
                  unitDesc: '元'
                }
                this.coupons.push(coupon)
              })
            } else {
              data.list.forEach(item => {
                const coupon = {
                  available: 1,
                  condition: item.coupon.condition,
                  reason: '已使用或已过期',
                  value: item.coupon.value * 100,
                  name: item.coupon.name,
                  startAt: moment(item.coupon.begin_date).unix(),
                  endAt: moment(item.coupon.end_date).unix(),
                  valueDesc: item.value,
                  unitDesc: '元'
                }
                this.disabledCoupons.push(coupon)
              })
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="less">

/deep/ .van-coupon-list__bottom {
  padding: 0;
}

/deep/ .van-coupon__corner {
  display: none;
}

</style>
