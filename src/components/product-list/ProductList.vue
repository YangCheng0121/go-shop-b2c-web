<template>
  <div class="product-list-wrapper">
    <divider text="猜你喜欢"/>
    <div
      class="product"
      v-for="product in data"
      :key="product.id"
      @click="toPage(product)">
      <img
        class="product__image"
        v-lazy="prefix + product.image.large">
      <div class="product__info">
        <!--Title-->
        <div class="product__info_title van-multi-ellipsis--l2">
          <van-tag type="danger" class="tag" size="small" v-for="tag in product.tags" :key="tag.id">
            {{ tag.name }}
          </van-tag>
          {{ product.brand_name }} {{ product.name }}
        </div>
        <!--Price-->
        <div class="product__info_price">
          ￥<span>{{ pricePair(product.skus[0].price * 100)[0] }}</span>.{{ pricePair(product.skus[0].price * 100)[1] }}
        </div>
        <!--Comment-->
        <div class="product__info_comment">
          4175条好评 好评率99%
        </div>
      </div>
    </div>
  </div>
</template>

<script type="es6">
import Divider from '../divider/Divider'
import { Tag } from 'vant'
import { productMixin } from '@/mixins'

export default {
  components: {
    Divider,
    [Tag.name]: Tag
  },
  name: 'ProductList',
  mixins: [productMixin],
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  methods: {
    toPage(product) {
      this.$router.push({
        name: 'ProductDetail',
        params: { sn: product.sn }
      })
    },
    pricePair(price) {
      return (price / 100).toFixed(2).split('.')
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

.divider-wrapper {
  margin: 0 auto;
  width: 80%;
}

.product {
  display: inline-block;
  background: #fff;
  position: relative;
  width: 50%;
  height: 260px;
  margin-bottom: 1px;
  padding: 15px 15px 0;
  box-sizing: border-box;
  border-radius: 10px;

  //&:nth-child(even) {
  //  float: right;
  //  margin-right: -1px;
  //}
  //
  //&:nth-child(odd) {
  //  float: left;
  //}

  &__image {
    display: block;
    margin: 0 auto;
    width: 160px;
    height: 160px;
  }

  &__info {
    padding-left: 10px;

    //Title
    &_title {
      margin: 4px 0;
      font-size: 14px;
      height: 28px;
      line-height: 1.13;

      .tag {
        margin-left: 3px;

        &:first-child {
          margin-left: 0;
        }
      }
    }

    //Price
    &_price {
      margin-top: 10px;
      margin-bottom: 6px;
      color: @theme;
      font-size: 12px;

      span {
        font-size: 16px;
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
