<template>
  <tab-bar active="ShopCart">
    <template #content>
      <!--Nar Bar-->
      <van-nav-bar
        fixed
        title="购物车"
        :right-text="rightText"
        @click-right="onClickRight"
      />
      <div class="card-container" v-if="shopcartCartItems.length">
        <div id="cardListWrap" class="card-list-wrap">
          <!--Card List-->
          <cube-scroll
            ref="scroll"
            class="card-list"
            :options="options">
            <van-checkbox-group v-model="result" ref="checkboxGroup">
              <!-- Card -->
              <van-swipe-cell
                class="card van-hairline--bottom"
                v-for="cartItem in shopcartCartItems"
                :key="cartItem.id">
                <van-checkbox :name="cartItem.id" :checked-color="checkedColor" label-disabled>
                  <van-card
                    class="goods-card"
                    :price="cartItem.sku.price.toFixed(2)"
                    :desc="cartItem.product.caption"
                    :title="cartItem.sku.name"
                    :thumb="cartItem.product.image.thumbUrl"
                    @click-thumb="toProductDetailPage(cartItem.product.sn)"
                  >
                    <template #tags>
                      <van-tag
                        class="tag"
                        type="danger"
                        v-for="promotion in cartItem.product.promotions"
                        :key="promotion.id">
                        {{ promotion.name }}
                      </van-tag>
                    </template>
                    <template #footer>
                      <van-stepper
                        v-model="cartItem.quantity"
                        @change="(value) =>_updateShopCartItem(Number(value),cartItem.sku)"/>
                    </template>
                  </van-card>
                </van-checkbox>
                <template #right>
                  <van-button
                    square
                    text="删除"
                    type="danger"
                    class="delete-button"
                    @click="_deleteShopCartItem(cartItem.id)"/>
                </template>
              </van-swipe-cell>
            </van-checkbox-group>
          </cube-scroll>
        </div>
        <van-submit-bar
          v-if="!idEdit"
          class="submit-bar van-hairline--top box-shadow"
          :price="totalPrice"
          button-text="去结算"
          @submit="onSubmit">
          <van-checkbox v-model="checkAll" @click="handleCheckAll" :checked-color="checkedColor">全选</van-checkbox>
        </van-submit-bar>
        <van-submit-bar
          v-else
          class="submit-bar van-hairline--top box-shadow"
          :disabled="!result.length"
          button-text="删除"
          @submit="handleDelete">
          <div class="submit-bar--checkbox">
            <van-checkbox v-model="checkAll" @click="handleCheckAll" :checked-color="checkedColor">全选</van-checkbox>
          </div>
        </van-submit-bar>
      </div>
      <van-empty v-else class="card-empty" description="购物车没货,加点货吧..."/>
    </template>
  </tab-bar>
</template>

<script type="es6">
import { TabBar } from '@/components'
import { deleteShopCartItem, updateShopCartItem } from '@/api/shopcart'
import { getCartKey } from '@/cache'
import { ERR_OK } from '@/api/config'
import { Dialog } from 'vant'
import { mapGetters } from 'vuex'

export default {
  components: {
    TabBar
  },
  name: 'Shopcart',
  computed: {
    /**
     * 单位为分
     */
    totalPrice() {
      let total = 0
      if (this.shopcartCartItems.length && this.result.length) {
        for (let i = 0, len = this.result.length; i < len; i++) {
          const cartItem = this.shopcartCartItems.find((value) => {
            return value.id === this.result[i]
          })
          total = total + cartItem.sku.price * cartItem.quantity * 100
        }
      }
      return total
    },
    /**
     * 全选
     */
    checkAll: {
      get() {
        if (!this.result.length) {
          return false
        }
        return this.result.length === this.shopcartCartItems.length
      },
      set() {
        return this.result.length
      }
    },
    ...mapGetters([
      'shopcartCartItems'
    ])
  },
  data() {
    return {
      quantity: 0,
      rightText: '编辑',
      idEdit: false,
      result: [],
      checkedColor: '#ee0a24',
      options: {
        scrollbar: true
      }
    }
  },
  mounted() {
    this._getShopCartCarItems()
  },
  activated() {
    this.$refs.scroll && this.$refs.scroll.refresh()
  },
  methods: {
    onClickRight() {
      this.idEdit = !this.idEdit
      this.rightText = this.idEdit ? '完成' : '编辑'
      if (this.idEdit) {
        this.result = []
      } else {
        this.checkedAll()
      }
    },
    /**
     * 全选处理
     */
    handleCheckAll() {
      if (!this.checkAll) {
        this.checkedAll()
      } else {
        this.result = []
      }
    },
    /**
     * 全选所有商品
     */
    checkedAll() {
      this.result = this.shopcartCartItems.map((item) => {
        return item.id
      })
    },
    /**
     * 提交
     */
    onSubmit() {
      this._checkoutOrder()
    },
    /**
     * 批量删除
     */
    handleDelete() {
      Dialog.confirm({
        title: '提示',
        message: '确定删除选择商品?'
      }).then(() => {
        // on close
        const ids = this.result.map((item) => {
          return item
        }).join(',')
        this._deleteShopCartItem(ids)
      }).catch(() => {

      })
    },
    /**
     * 跳转商品详情
     */
    toProductDetailPage(sn) {
      this.$router.push({
        name: 'ProductDetail',
        params: { sn: sn }
      })
    },
    /**
     * 获取购物车项
     * @private
     */
    _getShopCartCarItems() {
      this.$store.dispatch('GetShopCartCarItems').then(() => {
        this.checkedAll()
      })
    },
    /**
     * 更新购物车项
     * @param quantity
     * @param sku
     * @private
     */
    _updateShopCartItem(quantity, sku) {
      const cartKey = getCartKey()
      updateShopCartItem({
        cartKey,
        sku: JSON.stringify(sku),
        quantity
      }).then((res) => {
        if (res.err_code === ERR_OK) {

        }
      })
    },
    /**
     * 删除购物车项
     * @param ids
     * @private
     */
    _deleteShopCartItem(ids) {
      deleteShopCartItem(ids).then((res) => {
        if (res.err_code === ERR_OK) {
          this._getShopCartCarItems()
        }
      })
    },
    /**
     * 检出预订单
     * @private
     */
    _checkoutOrder() {
      const shopcartCartItems = []
      for (let i = 0, len = this.result.length; i < len; i++) {
        const cartItem = this.shopcartCartItems.find((value) => {
          return value.id === this.result[i]
        })
        shopcartCartItems.push(cartItem.id)
      }
      const code = ''
      const cartKey = getCartKey()
      this.$store.dispatch('CheckoutOrder', {
        cartItems: shopcartCartItems.join(','),
        code,
        cartKey
      }).then((data) => {
        this.$store.dispatch('SetCheckoutOrderReceiver', data.receiver).then(() => {
          this.$router.push({
            name: 'ConfirmOrder'
          })
        })
      })
    }
  }
}
</script>

<style lang="less">
.van-nav-bar__text {
  color: #333;
}

.van-checkbox__label {
  width: 100%;
}

.van-checkbox__icon {
  padding-left: 16px;
}
</style>

<style scoped lang="less">
.card-container {
  height: 100%;

  .card-list-wrap {
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 50px;
  }

  .submit-bar {
    bottom: 50px;

    &--checkbox {
      width: 100%;
      text-align: left;
    }
  }
}

.card-list {
  background: #fafafa;

  .card {
    background: #fff;

    /deep/ .van-checkbox__icon::after {
      position: absolute;
      content: "";
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
    }

    .goods-card {
      background: #fff;

      .tag {
        margin-right: 5px;
      }

      .van-card__content {
        width: 200px;
      }
    }

    .delete-button {
      height: 100%;
    }
  }
}

.card-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
}
</style>
