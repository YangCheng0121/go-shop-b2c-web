<template>
  <div class="product-list-wrapper">
    <div class="product" v-for="product in data" :key="product.id" @click="toPage(product)">
      <img
        class="product__image"
        v-lazy="prefix + (product.image ? product.image.thumbUrl : '')">
      <div class="product__info">
        <!--Title-->
        <div class="product__info__title van-multi-ellipsis--l2">
          <van-tag v-if="product.promotions" type="danger">
            {{ product.promotions[0].name }}
          </van-tag>
          {{ product.brand_name }} {{ product.name }}
        </div>
        <!--Price-->
        <div class="product__info__price" v-if="product.skus">
          ￥<span>{{ pricePair(product.skus[0].price)[0] }}</span>.{{ pricePair(product.skus[0].price)[1] }}
        </div>
        <div class="product__info__price" v-else>
          ￥<span>0</span>.00
        </div>
      </div>
    </div>
  </div>
</template>

<script type="es6">
import { pricePair } from '@/utils/util'
import { productMixin } from '@/mixins'

export default {
  name: 'ProductList',
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  mixins: [productMixin],
  methods: {
    pricePair,
    toPage(product) {
      this.$router.push({
        name: 'ProductDetail',
        params: { sn: product.sn }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '../../utils/css/index';

.product-list-wrapper {
  padding-right: 1px;
  overflow: hidden;
}

.product {
  display: inline-block;
  background: #fff;
  position: relative;
  float: left;
  width: calc(33.333333333333333333333333333333% - 1px);
  margin-bottom: 1px;
  box-sizing: border-box;
  border-radius: 10px;
  margin-right: 1px;

  &__image {
    display: block;
    margin: 0 auto;
    width: 110px;
    height: 110px;
  }

  &__info {
    padding-left: 10px;

    //Title
    &__title {
      padding: 7px 0 0;
      height: 3em;
      line-height: 1.5em;
      color: #333;
      font-size: 12px;
      font-weight: 400;
      white-space: normal;
    }

    //Price
    &__price {
      margin-top: 5px;
      margin-bottom: 6px;
      color: @theme;
      font-size: 12px;

      span {
        font-size: 16px;
      }
    }

  }
}
</style>
