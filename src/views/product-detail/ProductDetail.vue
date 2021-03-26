<template>
  <div class="product-wrapper" v-if="product">
    <van-tabs v-model="activeTab" scrollspy sticky class="tabs-wrapper">
      <!-- Product-->
      <van-tab name="Product">
        <template #title>
          <div class="arrow-left-wrapper" @click.stop.prevent="back">
            <van-icon name="arrow-left" class="arrow-left"/>
          </div>
          商品
        </template>
        <div class="product">
          <div class="product__swipe" v-if="product.product_images">
            <van-swipe
              :autoplay="3000"
              indicator-color="white"
              @change="onChange">
              <van-swipe-item v-for="image in product.product_images" :key="image.id">
                <img v-lazy="prefix + image.large">
              </van-swipe-item>
              <template #indicator>
                <div class="product__swipe__indicator">
                  {{ currentIndicator + 1 }}/ {{ product.product_images.length }}
                </div>
              </template>
            </van-swipe>
          </div>
          <van-cell-group v-if="product.skus">
            <van-cell>
              <div class="product__price">
                ￥<em>{{ pricePair(product.skus[0].price)[0] }}</em>
                <span class="price__decimals">.{{ pricePair(product.skus[0].price)[1] }}</span>
              </div>
              <h1 class="product__title">{{ product.brand_name }} {{ product.name }}</h1>
              <div class="product__sub-title van-multi-ellipsis--l2">
                {{ product.caption }}
              </div>
            </van-cell>
          </van-cell-group>
        </div>
      </van-tab>
      <!--Comment-->
      <van-tab title="评价" class="comment-wrapper" name="Comment">
        <van-cell-group class="comment__list" v-if="reviewList.list">
          <van-cell :title="`商品评价 (${reviewList.total})`" is-link value="好评率99.3%" class="comment__header"/>
          <van-cell class="comment__list__item" v-for="review in reviewList.list" :key="review.id">
            <div class="user">
              <van-icon class="user__icon" name="https://b.yzcdn.cn/vant/icon-demo-1126.png"/>
              <span class="user__name">{{ review.username }}</span>
              <van-rate class="user__rate" v-model="review.score" readonly size="12"/>
              <span class="user__date">{{ review.creation_date | Moment('YYYY-MM-DD') }}</span>
            </div>
            <p class="comment__list__item__content van-multi-ellipsis--l3">
              {{ review.content }}
            </p>
          </van-cell>
          <van-cell>
            <template #default>
              <van-button
                class="comment__list__more"
                round
                type="default"
                size="small"
                icon="arrow"
                icon-position="right"
                text="查看全部评价"/>
            </template>
          </van-cell>
        </van-cell-group>
        <van-cell-group class="comment__list" v-else>
          <van-empty description="暂无评价,快快下单评价吧"/>
        </van-cell-group>
      </van-tab>
      <van-tab title="详情" name="Detail">
        <van-cell class="product-list">
          <van-tabs v-model="midActiveTab" animated>
            <van-tab title="猜你喜欢" name="guess">
              <van-swipe
                class="product-list__swipe"
                indicator-color="#ee0a24">
                <van-swipe-item>
                  <three-product-list :data="guessProductPageList.list"/>
                </van-swipe-item>
              </van-swipe>
            </van-tab>
            <van-tab title="热销商品" name="hot">
              <three-product-list :data="hotProductList.list"/>
            </van-tab>
          </van-tabs>
        </van-cell>
        <van-cell class="product-detail" v-if="product.introduction">
          <div v-html="product.introduction"/>
        </van-cell>
      </van-tab>
    </van-tabs>
    <van-goods-action class="van-hairline--top">
      <van-goods-action-icon icon="chat-o" text="客服"/>
      <van-goods-action-icon icon="cart-o" text="购物车" :to="{name: 'ShopCart'}" :badge="shopcartCount || null"/>
      <van-goods-action-icon icon="wap-home-o" text="首页" :to="{name: 'Index'}"/>
      <van-goods-action-button type="warning" text="加入购物车" @click="onClickButton"/>
      <van-goods-action-button type="danger" text="立即购买" @click="onClickButton"/>
    </van-goods-action>

    <!--SKU-->
    <van-sku
      v-model="showBase"
      :sku="sku"
      :goods="sku.goods"
      :goods-id="product.id"
      disable-stepper-input
      reset-stepper-on-hide
      safe-area-inset-bottom
      reset-selected-sku-on-hide
      @buy-clicked="onBuyClicked"
      @add-cart="onAddCartClicked"
    />
  </div>
</template>

<script type="es6">
import { ThreeProductList } from '@/components'
import { getProduct, getProductReviewList, getProductSpecificationList } from '@/api/product'
import { ERR_OK } from '@/api/config'
import { pricePair } from '@/utils/util'
import { mapGetters } from 'vuex'
import { addShopCartItem, getShopCartCarItems } from '@/api/shopcart'
import { getCartKey, saveCartKey } from '@/cache'
import { productMixin } from '@/mixins'

export default {
  components: {
    ThreeProductList
  },
  name: 'ProductDetail',
  mixins: [productMixin],
  computed: {
    ...mapGetters([
      'shopcartCount',
      'guessProductPageList',
      'hotProductList'
    ])
  },
  watch: {
    $route(newRoute, oldRoute) {
      if (newRoute.name === 'ProductDetail' && newRoute.name === oldRoute.name) {
        this._getProduct()
        window.scrollTo(0, 0)
      }
    }
  },
  data() {
    return {
      product: null,
      reviewList: [],
      currentIndicator: 0, // 当前轮播图
      activeTab: 'Product', // 当前tab
      midActiveTab: 'guess',
      // SKU
      showBase: false,
      sku: {} // SKU
    }
  },
  mounted() {
    this._getProduct()
    this.$store.dispatch('GetShopCartCount')
  },
  methods: {
    pricePair,
    back(e) {
      e.preventDefault()
      this.$router.back()
    },
    onChange(index) {
      this.currentIndicator = index
    },
    onClickButton() {
      this.showBase = true
    },
    onBuyClicked(data) {
      const selectedSkuComb = data.selectedSkuComb
      const skuId = selectedSkuComb.id
      const quantity = data.selectedNum
      const cartKey = '' // 新的购物车
      this._addShopCartItem({ skuId, quantity, cartKey }).then((cartKey) => {
        getShopCartCarItems(cartKey).then((res) => {
          const cartItems = res.data.map((item) => {
            return item.id
          }).join(',')
          const code = ''
          this.$store.dispatch('CheckoutOrder', {
            cartItems: cartItems,
            code,
            cartKey
          }).then((data) => {
            this.$store.dispatch('SetCheckoutOrderReceiver', data.receiver).then(() => {
              this.$router.push({
                name: 'ConfirmOrder'
              })
            })
          })
        })
      })
    },
    /**
     * 点击添加购物车
     */
    onAddCartClicked(data) {
      const selectedSkuComb = data.selectedSkuComb
      const skuId = selectedSkuComb.id
      const quantity = data.selectedNum
      const cartKey = getCartKey()
      this._addShopCartItem({ skuId, quantity, cartKey }).then((cartKey) => {
        saveCartKey(cartKey)
        this.$store.dispatch('GetShopCartCount')
        this.$store.dispatch('GetShopCartCarItems')
        this.$toast('添加成功')
      })
    },
    _addShopCartItem({ skuId, quantity, cartKey }) {
      return new Promise(resolve => {
        addShopCartItem({
          skuId,
          quantity,
          cartKey
        }).then((res) => {
          if (res.err_code === ERR_OK) {
            this.showBase = false
            resolve(res.data)
          }
        })
      })
    },
    /**
     * 获取商品
     * @private
     */
    _getProduct() {
      const sn = this.$route.params.sn
      getProduct(sn).then((res) => {
        if (res.err_code === ERR_OK) {
          this.product = res.data
          this._getProductReviewList(this.product.id)
          this.$store.dispatch('GetGuessProductList', {
            pageNumber: 1,
            pageSize: 6
          })
          this.$store.dispatch('GetHotProductList', {
            pageNumber: 1,
            pageSize: 6
          })
          this._getProductSpecificationList()
        }
      })
    },
    /**
     * 获取商品评论
     * @param productId
     * @private
     */
    _getProductReviewList(productId) {
      const query = {
        ProductId: productId
      }
      const sortby = 'CreationDate'
      const order = 'desc'
      const pageNumber = 1
      const pageSize = 10
      getProductReviewList({
        query,
        sortby,
        order,
        pageNumber,
        pageSize
      }).then((res) => {
        if (res.err_code === ERR_OK) {
          this.reviewList = res.data
        }
      })
    },
    /**
     * 获取商品后台选中规格
     * @private
     */
    _getProductSpecificationList() {
      const id = this.product.id
      getProductSpecificationList(id).then((res) => {
        if (res.err_code === ERR_OK) {
          if (this.product.skus && res.data) {
            this.initMoreSku(res.data)
          } else {
            this.initOneSku()
          }
        }
      })
    },
    /**
     * 初始化无规格 SKU
     */
    initOneSku() {
      const product = this.product
      const sku = product.skus[0]
      this.sku = {
        goods: {
          // 默认商品 sku 缩略图
          picture: this.prefix + product.image.url
        },
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: [],
        price: sku.price.toFixed(2), // 默认价格（单位元）
        stock_num: sku.stock, // 商品总库存
        collection_id: sku.sku_id, // 无规格商品 skuId 取 collection_id，否则取所选 sku 组合对应的 id
        messages: [],
        none_sku: true, // 是否无规格商品
        hide_stock: false // 是否隐藏剩余库存
      }
    },
    /**
     * 初始化有规格 SKU
     */
    initMoreSku(specificationList) {
      // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
      // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
      const tree = specificationList.map((item) => {
        const treeItem = {
          k: item.name, // skuKeyName：规格类目名称
          k_s: item.name, // skuKeyStr：sku 组合列表（下方 list）中当前类目对应的 key 值，value 值会是从属于当前类目的一个规格值 id
          k_id: item.id,
          v: []
        }
        if (item.options) {
          treeItem.v = item.options.map((o) => {
            return {
              id: o.value, // skuValueId：规格值 id
              name: o.value // skuValueName：规格值名称
            }
          })
        }

        return treeItem
      })
      // 所有 sku 的组合列表，比如红色、M 码为一个 sku 组合，红色、S 码为另一个组合
      const list = this.product.skus.map((item) => {
        const listItem = {
          id: item.sku_id, // skuId
          price: item.price * 100, // 价格（单位分）
          stock_num: item.stock // 当前 sku 组合对应的库存
        }

        const values = item.specification_values.split(',').filter(item => item)

        specificationList.forEach((s, index) => {
          listItem[s.name] = values[index]
        })

        return listItem
      })

      const price = this.product.skus[0].price.toFixed(2) // 默认价格（单位元）
      let stockNum = 0 // 商品总库存
      this.product.skus.forEach((item) => {
        stockNum += item.stock
      })

      // Goods
      const goods = {
        // 默认商品 sku 缩略图
        picture: this.product.image.thumbUrl
      }

      this.sku = {
        tree,
        list,
        price: price,
        stock_num: stockNum,
        goods,
        none_sku: false, // 是否无规格商品
        hide_stock: false // 是否隐藏剩余库存
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '../../utils/css/index';

.product-wrapper {
  background: @background;

  .tabs-wrapper {
    padding-bottom: 60px;
  }
}

.arrow-left-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 30px;
  height: 44px;
  line-height: 44px;
  text-align: center;
}

//Product
.product {

  &__swipe {
    img {
      width: 100%;
      display: block;
    }

    &__indicator {
      position: absolute;
      right: 0;
      bottom: 15px;
      height: 20px;
      line-height: 20px;
      padding: 0 10px;
      font-size: 12px;
      color: #fff;
      border-radius: 10px 0 0 10px;
      background: rgba(0, 0, 0, .2);
    }

  }

  &__price {
    line-height: 30px;
    font-size: 16px;
    color: #f44;

    em {
      font-size: 30px;
      font-style: normal;
    }
  }

  &__title {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
  }

  &__sub-title {
    padding-top: 18px;
    color: #666;
    font-size: 12px;
  }

  &__express {
    color: #999;
    font-size: 12px;
    padding: 5px 15px;
  }

  &__cell-group {
    margin: 15px 0;

    .van-cell__value {
      color: #999;
    }
  }

  &__tag {
    margin-left: 5px;
  }
}

//Comment
.comment-wrapper {
  margin: 10px 0;
  border-radius: 12px;
  overflow: hidden;

  .comment__list {
    &__item {
      .user {
        display: flex;
        align-items: center;

        &__name {
          margin: 0 4px;
        }

        &__date {
          margin-left: auto;
        }
      }

      &__content {
        margin: 10px 0;
        line-height: 1.5;
        font-size: 13px;
        word-break: break-all;
        overflow: hidden;
        white-space: normal;
        max-height: 126px;
      }
    }

    &__more {
      display: block;
      margin: 0 auto;
    }
  }
}

.product-list {
  border-radius: 12px;

}

.product-detail {
  border-radius: 12px;
  margin-top: 10px;

  /deep/ img {
    width: 100%;
    height: 100%;
  }
}
</style>
