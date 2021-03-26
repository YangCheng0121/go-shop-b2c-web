<template>
  <page-layout>
    <template #header>
      <van-search
        v-model="keyword"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @input="handleInputChange"
        @clear="handleClear"
        shape="round">
        <template #left>
          <a class="arrow-left-wrapper" @click="back">
            <van-icon name="arrow-left"/>
          </a>
        </template>
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </template>

    <template #before-content>
      <div class="dropdown-menu-wrapper van-hairline--bottom" v-if="false">
        <van-dropdown-menu z-index="200" class="dropdown-menu">
          <van-dropdown-item v-model="value1" :options="option1" @change="handleFilter"/>
          <van-dropdown-item v-model="value2" :options="option2"/>
        </van-dropdown-menu>
        <van-button class="dropdown-menu-filter" @click="showFilterPopup">
          <template #default>
            <span>筛选</span>
            <van-icon size="15" class="dropdown-menu-filter__icon" name="filter-o"/>
          </template>
        </van-button>
      </div>
    </template>

    <template #content>
      <!--Association Normal-->
      <ul class="association-normal-wrapper" v-if="false">
        <li v-for="item in [1,2,3,4,5,6]" :key="item" class="van-hairline--bottom">
          <div>
            <span class="association-product-name">
              <span class="search_string">移动</span>
              硬盘
            </span>
            <span class="association-product-btn">固态</span>
            <span class="association-product-btn">2t</span>
            <span class="association-product-btn">1t</span>
          </div>
        </li>
      </ul>

      <!--Recent And Hot Search-->
      <div class="recent-hot-search-wrapper" v-if="isShowRecentAndHot">
        <div class="recent-search" v-if="recentSearchList.length">
          <div class="recent-search__header">
            <span class="recent-search__header_title">最近搜索</span>
            <van-icon
              class="recent-search__header_icon"
              name="delete"
              size="18"
              @click="deleteRecentSearch"/>
          </div>
          <div class="recent-search__tags">
            <van-tag
              color="#f0f2f5"
              text-color="#686868"
              class="recent-search__tags_tag"
              v-for="(recentSearch,index) in recentSearchList"
              :key="index"
              @click="handleSearchKeyword(recentSearch)">
              {{ recentSearch }}
            </van-tag>
          </div>
        </div>
        <div class="hot-search">
          <div class="hot-search__header">
            <span class="hot-search__header_title">热门搜索</span>
            <span class="hot-search__header_hide" @click="toggleVisibleHotSearch">
              {{ isHideHotSearch ? '显示' : '隐藏' }}
            </span>
          </div>
          <div class="hot-search__tags">
            <div class="hot-search__tags_hide-tip" v-if="isHideHotSearch">已隐藏搜索发现</div>
            <template v-else>
              <van-tag
                color="#f0f2f5"
                text-color="#686868"
                class="hot-search__tags_tag"
                v-for="(hotSearch,index) in hotSearchList"
                :key="index"
                :class="{'hot-search-red': index === 0}"
                @click="handleSearchKeyword(hotSearch)">
                {{ hotSearch }}
              </van-tag>
            </template>
          </div>
        </div>
      </div>

      <!--Search Result-->
      <div class="search-result-wrapper">
        <van-empty description="搜不到商品，换个关键词试试吧" v-if="isShowEmptyTip"/>
        <vertical-product-list
          v-else
          :data="productPageList.list"/>
      </div>

      <!--Filter Popup-->
      <van-popup
        v-model="filterPopup"
        position="right"
        :style="{ width: '90%', height: '100%' }"
        class="popup-wrapper"
        get-container="body">
        <div class="parameter-group-wrapper">
          <div class="parameter-group" v-for="item in [1,2,3,4,5,6,7]" :key="item">
            <div class="parameter-group__header van-hairline--bottom">
              <h4 class="big">
                品牌
              </h4>
              <p class="right">
                <span class="van-ellipsis">
                  三星（SAMSUNG）三星（SAMSUNG）三星（SAMSUNG）三星（SAMSUNG）三星（SAMSUNG）
                </span>
              </p>
            </div>
            <ul class="parameter-group__content">
              <li
                class="parameter-group__content_item"
                v-for="i in [1,2,3,4,5,6,7]"
                :key="i"
                :class="{'selected': i % 2 > 0}">
                <span>苹果</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="button-group van-hairline--top">
          <van-button class="button" @click="handleCancel">取消</van-button>
          <van-button class="button" color="#ee0a24">确认</van-button>
        </div>
      </van-popup>
    </template>
  </page-layout>
</template>

<script type="es6">
import { PageLayout } from '@/layouts'
import { VerticalProductList } from '@/components'
import { search, getHotSearch } from '@/api/search'
import { ERR_OK } from '@/api/config'
import { saveSearch, getSearch, removeSearch } from '@/cache'
import { Dialog } from 'vant'

export default {
  components: {
    PageLayout,
    VerticalProductList
  },
  name: 'Search',
  computed: {
    /**
     * 是否显示筛选
     */
    isShowFilter() {
      return !!(this.productPageList.list && this.productPageList.list.length && !this.isFocus)
    },
    /**
     * 是否显示搜索建议
     */
    isShowSearchSuggest() {
      return !!(this.isFocus && this.keyword)
    },
    /**
     * 是否显示最近搜索
     */
    isShowRecentAndHot() {
      return !this.isFocus && !this.keyword
    },
    /**
     * 是否显示空提示
     */
    isShowEmptyTip() {
      return !!(!this.isFocus && !this.productPageList.list && this.keyword)
    }
  },
  watch: {
    keyword(newVal) {
      if (!newVal) {
        this.handleClear()
      }
    }
  },
  data() {
    return {
      keyword: '',
      isFocus: false,
      isHideHotSearch: false,
      value1: '',
      value2: '',
      option1: [
        {
          text: '综合',
          value: ''
        },
        {
          text: '最新上架',
          value: 'CreationDate'
        },
        {
          text: '价格最高',
          value: 'PriceTop'
        },
        {
          text: '价格最低',
          value: 'PriceLowest'
        }
      ],
      option2: [
        {
          text: '默认排序',
          value: ''
        },
        {
          text: '好评排序',
          value: 'b'
        },
        {
          text: '销量排序',
          value: 'Sales'
        }
      ],
      productPageList: {},
      filterPopup: false,
      hotSearchList: [], // 热门搜索
      recentSearchList: [] // 最近搜索
    }
  },
  mounted() {
    this._getHotSearch()
    this._setRecentSearch()
    const keyword = this.$route.query.keyword
    keyword && this.handleSearchKeyword(keyword)
  },
  methods: {
    back() {
      this.$router.back()
    },

    /**
     * 搜索回调
     */
    onSearch() {
      const pageNumber = 1
      const pageSize = 20
      const keyword = this.keyword
      this.isFocus = false
      this.saveRecentSearch(keyword)
      this._search({
        keyword,
        pageNumber,
        pageSize
      })
    },
    handleClear() {
      this.isFocus = false
      this.productPageList = {}
    },
    /**
     * 搜索框 Input 值改变时
     * @param value
     */
    handleInputChange(value) {
      this.isFocus = !!value
    },
    showFilterPopup() {
      this.filterPopup = true
    },
    /**
     * Popup 取消处理
     */
    handleCancel() {
      this.filterPopup = false
    },
    /**
     * 切换热门搜索显示
     */
    toggleVisibleHotSearch() {
      this.isHideHotSearch = !this.isHideHotSearch
    },
    /**
     * 处理关键词搜索
     */
    handleSearchKeyword(keyword) {
      this.keyword = keyword
      this.setKeyWord(keyword)
      this.onSearch()
    },
    /**
     * 设置路由 keyword
     */
    setKeyWord(keyword) {
      if (this.keyword === keyword) {
        return
      }
      this.$router.replace({
        name: 'Search',
        query: {
          keyword: keyword
        }
      })
    },
    /**
     * 处理筛选回调
     */
    handleFilter(value) {
    },
    /**
     * 搜索
     * @param query
     * @param sortby
     * @param keyword
     * @param pageNumber
     * @param pageSize
     * @param order
     * @private
     */
    _search({
      query,
      sortby,
      keyword,
      pageNumber,
      pageSize,
      order
    }) {
      search({
        query,
        sortby,
        keyword,
        order,
        pageNumber,
        pageSize
      }).then((res) => {
        if (res.err_code === ERR_OK) {
          this.productPageList = res.data
        }
      })
    },
    /**
     * 保存最近搜索到本地
     * @param keyword
     */
    saveRecentSearch(keyword) {
      const recentSearch = getSearch()
      if (!recentSearch) {
        saveSearch([keyword])
      } else {
        if (!recentSearch.includes(keyword)) {
          recentSearch.push(keyword)
          saveSearch(recentSearch)
        }
      }
      this._setRecentSearch()
    },
    /**
     * 设置最近搜索
     */
    _setRecentSearch() {
      this.recentSearchList = getSearch() || []
    },
    /**
     * 删除最近删除
     */
    deleteRecentSearch() {
      Dialog.confirm({
        title: '提示',
        message: '是否确认删除最近搜索内容?'
      }).then(() => {
        removeSearch()
        this._setRecentSearch()
      }).catch(() => {
      })
    },
    /**
     * 获取热门搜索
     * @private
     */
    _getHotSearch() {
      getHotSearch().then((res) => {
        if (res.err_code === ERR_OK) {
          this.hotSearchList = res.data
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '../../utils/css/index';

.arrow-left-wrapper {
  width: 30px;
  height: 100%;
}

.dropdown-menu-wrapper {
  display: flex;

  .dropdown-menu {
    flex: 1;

    /deep/ .van-dropdown-menu__bar {
      box-shadow: initial;
    }
  }

  .dropdown-menu-filter {
    flex: 0 0 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0;
    height: 48px;
    line-height: 22px;
    border: none;
    color: #323233;
    font-size: 15px;
    background: #fff;

    &__icon {
      position: relative;
      top: 2px;
    }
  }
}

// Association Normal
.association-normal-wrapper {
  padding-left: 12px;
  background: #fff;

  li {
    height: 42px;
    display: block;
    padding-right: 12px;
    list-style: none;

    div {
      display: flex;
      height: 42px;
      align-items: center;
      overflow: hidden;

      .association-product-name {
        flex: 1;
        padding-top: 1px;
        padding-bottom: 1px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: @color;
        font-size: 13px;
      }

      .association-product-btn {

        display: block;
        height: 23px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 3px;
        line-height: 23px;
        margin-right: 10px;
        background-color: #f0f2f5;
        color: #686868;
        font-size: 12px;
      }
    }
  }
}

// Recent And Hot Search
.recent-hot-search-wrapper {
  background: #fff;

  .recent-search, .hot-search {
    padding: 15px;

    &__header {
      display: flex;

      &_title {
        font-size: 15px;
        line-height: 15px;
        color: #232326;
        width: 100px;
        padding-left: 1px;
        flex: 1;
      }

      &_icon {
        flex: 0 0 30px;
        text-align: center;
      }

      &_hide {
        flex: 0 0 30px;
        line-height: 15px;
        font-size: 15px;
        color: #999;
      }
    }

    &__tags {
      padding-top: 11px;

      &_tag {
        margin-right: 10px;
        margin-bottom: 10px;
        height: 23px;
        line-height: 24px;
        padding: 0 13px;
        border-radius: 3px;

        &.hot-search-red {
          color: #e93b3d !important;
        }
      }

      &_hide-tip {
        height: 30px;
        margin: 29px auto 40px;
        line-height: 30px;
        text-align: center;
        font-size: 12px;
        color: #999;
      }
    }
  }
}

// Search Result
.search-result-wrapper {
  background: #fff;
  margin-bottom: 48px;
}

.popup-wrapper {
  overflow: initial;
}

// Parameter Group
.parameter-group-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow: scroll;
  background: @background;

  .parameter-group {
    margin-top: 10px;
    font-size: 12px;
    background: #fff;

    &:first-child {
      margin-top: 0;
    }

    &__header {
      display: flex;
      padding: 10px;

      .big {
        height: 25px;
        line-height: 25px;
        max-width: 250px;
        overflow: hidden;
        font-size: 16px;
        color: #333;
        text-overflow: ellipsis;
      }

      .right {
        height: 25px;
        line-height: 25px;
        flex: 1;
        margin-left: 5px;
        text-align: right;
        font-size: 12px;
        color: #999;

        span {
          display: inline-block;
          max-width: 203px;
        }
      }
    }

    &__content {
      overflow: hidden;
      padding: 10px;

      &_item {
        box-sizing: border-box;
        float: left;
        width: 33.33%;
        padding-right: 10px;
        height: 30px;
        line-height: 30px;
        margin-bottom: 10px;
        overflow: hidden;
        text-align: center;

        &.selected {
          span {
            color: #e4393c;
            background-color: #fdf0f0;
            height: 30px;
            line-height: 30px;

            &::after {
              content: "";
              position: absolute;
              right: 0;
              bottom: 0;
              width: 15px;
              height: 15px;
              border-radius: 0 0 2px 0;
              background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeBAMAAADJHrORAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAhUExURUdwTOQ4POQ5PPrV1f///+dGSO17ff3u7/Kio+lcXvW4uZrptW4AAAACdFJOUwB/timhlQAAAH1JREFUGNNdzkEOQDAQheG6Qo/whNjjBBWs9QbiCFzExl4cFG1HzOvuz5fpjDHqZTqNJQYxiEEMYhCDGMQgBjGIQQxiEOPPRf114NxJx+lrkw5cDXvqyEsv/z1cT2U3p365aY9R9r3T3q1n6ri7cXJPPM23qeVyudfq1gxi3DyiIhPh30TpAAAAAElFTkSuQmCC) no-repeat;
              background-size: 15px auto;
              overflow: hidden;
              z-index: 1;
            }
          }
        }

        span {
          position: relative;
          display: block;
          padding: 0 5px;
          color: #666;
          background-color: #f7f7f7;
          border-radius: 4px;
        }
      }

    }

  }
}

// Button Group
.button-group {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background: #fff;

  .button {
    width: 50%;
    height: 100%;
    border: none;
  }
}
</style>
