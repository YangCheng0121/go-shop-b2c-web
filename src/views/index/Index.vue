<template>
  <tab-bar active="Index">
    <template #content>
      <router-link to="/search" class="header">
        <van-search
          v-model="search"
          shape="round"
          placeholder="请输入搜索关键词"
          disabled
        />
      </router-link>
      <div id="indexContent" class="content">
        <cube-scroll
          ref="scroll"
          :options="options">
          <!--Banner-->
          <van-swipe class="banner" :autoplay="3000" indicator-color="white" height="130">
            <van-swipe-item v-for="(banner, index) in banners" :key="index">
              <img :src="prefix + banner.path"/>
            </van-swipe-item>
          </van-swipe>

          <!--Characteristic-->
          <div class="characteristic">
            <ul>
              <li>大牌品质</li>
              <li>/</li>
              <li>工厂价格</li>
              <li>/</li>
              <li>分期支付</li>
              <li>/</li>
              <li>顺丰包邮</li>
              <li>/</li>
              <li>无忧退款</li>
            </ul>
          </div>

          <!--Operational-->
          <div class="operational">
            <ul>
              <li>
                <img
                  src="./images/point_icon.png"
                  class="operational-icon">
                <p>积分商城</p>
              </li>
              <li>
                <img
                  src="./images/group_icon.png"
                  class="operational-icon">
                <p>团购商城</p>
              </li>
              <li>
                <img
                  src="./images/day_icon.png"
                  class="operational-icon">
                <p>每日签到</p>
              </li>
              <li>
                <img
                  src="./images/new_icon.png"
                  class="operational-icon">
                <p>每日上新</p>
              </li>
            </ul>
          </div>

          <!--BlockLine-->
          <div class="block-line"></div>

          <!--Category ProductList-->
          <div class="category-product-list-wrapper">
            <div class="product-list" v-for="category in productCategoryList" :key="category.id">
              <divider :text="category.name"/>
              <three-product-list :data="category.products"/>
            </div>
          </div>

          <!--ProductList-->
          <product-list :data="guessProductPageList.list"/>
        </cube-scroll>
      </div>
    </template>
  </tab-bar>
</template>

<script type="es6">
import { TabBar, ProductList, ThreeProductList, Divider } from '@/components'
import { getBanner, getIndexData } from '@/api'
import { ERR_OK } from '@/api/config'
import { mapGetters } from 'vuex'
import { productMixin } from '@/mixins'

export default {
  components: {
    TabBar,
    ProductList,
    ThreeProductList,
    Divider
  },
  mixins: [productMixin],
  name: 'Index',
  computed: {
    ...mapGetters([
      'guessProductPageList'
    ])
  },
  data() {
    return {
      search: '',
      images: [],
      loading: false,
      finished: false,
      options: {
        scrollbar: true
      },
      productCategoryList: [],
      banners: []
    }
  },
  mounted() {
    this._getBanner()
    this._getIndexData()
    this.$store.dispatch('GetGuessProductList', {
      pageNumber: 1,
      pageSize: 10
    })
  },
  activated() {
    this.$refs.scroll && this.$refs.scroll.refresh()
  },
  methods: {
    /**
     * 获取首页数据
     * @private
     */
    _getIndexData() {
      getIndexData().then((res) => {
        if (res.err_code === ERR_OK) {
          this.productCategoryList = res.data
        }
      })
    },
    /**
     * 获取轮播图
     * @private
     */
    _getBanner() {
      getBanner().then((res) => {
        if (res.err_code === ERR_OK) {
          this.banners = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '../../utils/css/index';

.header {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  z-index: 100;
}

.content {
  position: absolute;
  top: 54px;
  left: 0;
  right: 0;
  bottom: 0;
  //Banner
  .banner {
    img {
      width: 100%;
      height: 100%;
    }
  }

  //Characteristic
  .characteristic {
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    color: @color;
    background: #fff;

    ul {
      display: flex;
      justify-content: space-around;
    }
  }

  //Operational
  .operational {
    padding: 15px;
    background: #fff;

    ul {
      display: flex;
      flex-wrap: wrap;
      align-items: center;

      li {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        .operational-icon {
          width: 24px;
          height: 24px;
        }

        p {
          margin-top: 5px;
          color: #666;
          font-size: 10px;
        }
      }
    }
  }

  //BlockLine
  .block-line {
    width: 100%;
    height: 10px;
    background: @background;
  }

}

.loading {
  margin-bottom: 20px;
  text-align: center;
}
</style>
