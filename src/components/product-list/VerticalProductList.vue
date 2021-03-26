<template>
  <div class="vertical-product-list-wrapper">
    <div class="product-wrapper van-hairline--bottom" v-for="product in data" :key="product.id" @click="toPage">
      <div class="product">
        <img
          class="product__image"
          v-lazy="prefix + (product.image ? product.image.thumbUrl : '')">
        <div class="product__info">
          <!--Title-->
          <div class="product__info_title van-multi-ellipsis--l2">
            {{ product.brand_name }} {{ product.name }}
          </div>
          <!--Parameters-->
          <div class="product__info_parameter">
            <van-tag
              color="#f2f2f7"
              text-color="#999"
              v-for="parameter in product.parameters"
              :key="parameter.id"
              v-if="parameter.value">
              {{ parameter.value }}
            </van-tag>
          </div>
          <!--Price-->
          <div class="product__info_price van-ellipsis">
            ￥<span>90</span>.00
            <van-tag
              v-if="product.promotions"
              v-for="promotion in product.promotions"
              :key="promotion.id"
              type="danger"
              class="tag"
              size="small">
              {{ promotion.name }}
            </van-tag>
          </div>
          <!--Comment-->
          <div class="product__info_comment">
            4175条好评 好评率99%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="es6">
import { productMixin } from '@/mixins'

export default {
  name: 'VerticalProductList',
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
    toPage() {
      this.$router.push({
        name: 'ProductDetail',
        params: {
          id: Math.random()
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '../../utils/css/index';

.product-wrapper {
  display: block;
  position: relative;
  padding: 5px 0 5px 10px;
  background-color: #fff;
}

.product {
  position: relative;
  padding-left: 120px;

  &__image {
    position: absolute;
    left: 0;
    top: 0;
    width: 120px;
    height: 120px;
    overflow: hidden;
  }

  &__info {
    min-height: 120px;
    padding: 8px 10px 0 10px;

    &_title {
      height: 38px;
      word-break: break-all;
      color: #333;
      line-height: 1.36;
      font-size: 14px;
    }

    //Parameter
    &_parameter {
      margin-top: 7px;
    }

    //Price
    &_price {
      height: 30px;
      line-height: 30px;
      margin-bottom: 6px;
      color: @theme;
      font-size: 12px;

      span {
        font-size: 16px;
      }

      .tag {
        font-size: 12px;
        margin-right: 3px;
      }
    }

    //Comment
    &_comment {
      color: #ddd;
      font-size: 10px;
    }
  }
}
</style>
