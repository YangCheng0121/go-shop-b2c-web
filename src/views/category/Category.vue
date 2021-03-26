<template>
  <tab-bar>
    <template #content>
      <van-search shape="round" placeholder="请输入搜索关键词" disabled class="van-hairline--bottom" @click="toSearchPage"/>
      <div class="sidebar-container">
        <div id="sidebarWrap" class="side-wrapper">
          <cube-scroll
            ref="slideBarScroll"
            :options="options">
            <van-sidebar class="sidebar" v-model="activeKey" @change="handleSidebarChange">
              <van-sidebar-item
                v-for="category in rootCategoryList"
                :key="category.id">
                <template #title>
                  <span class="sidebar--title">
                    {{ category.name }}
                  </span>
                </template>
              </van-sidebar-item>
            </van-sidebar>
          </cube-scroll>
        </div>
        <div id="sidebarContent" class="sidebar-content">
          <cube-scroll
            ref="categoryListScroll"
            :options="options">
            <ul class="category-list-wrapper">
              <li class="category-list" v-for="category in childrenCategoryList" :key="category.id">
                <h4 class="category-list__title">
                  {{ category.name }}
                </h4>
                <ul class="category-list__list">
                  <li
                    class="category-list__list_list-item"
                    v-for="child in category.children"
                    :key="child.id"
                    @click="toSearchPage(child.name)">
                    <img v-lazy="child.image"/>
                    <span>{{ child.name }}</span>
                  </li>
                </ul>
              </li>
            </ul>
          </cube-scroll>
        </div>
      </div>
    </template>
  </tab-bar>
</template>

<script type="es6">
import { TabBar } from '@/components'
import { findChildrenCategory, findRootCategory } from '@/api/category'
import { ERR_OK } from '@/api/config'
import { IMAGE_PREFIX } from '@/config/axios.config'

export default {
  components: {
    TabBar
  },
  name: 'Category',
  data() {
    return {
      search: '',
      activeKey: 0,
      list: [],
      options: {
        scrollbar: true
      },
      rootCategoryList: [],
      childrenCategoryList: []
    }
  },
  mounted() {
    this._findRootCategory().then(() => {
      const id = this.rootCategoryList[this.activeKey].id
      this._findChildrenCategory(id)
    })
  },
  activated() {
    this.$refs.slideBarScroll && this.$refs.slideBarScroll.refresh()
    this.$refs.categoryListScroll && this.$refs.categoryListScroll.refresh()
  },
  methods: {
    /**
     * 跳转搜索页
     */
    toSearchPage(keyword) {
      this.$router.push({
        name: 'Search',
        query: { keyword: keyword }
      })
    },
    /**
     * 获取顶级分类
     * @private
     */
    _findRootCategory() {
      return new Promise(resolve => {
        findRootCategory().then((res) => {
          if (res.err_code === ERR_OK) {
            this.rootCategoryList = res.data
            resolve()
          }
        })
      })
    },
    /**
     * 获取子分类
     * @private
     */
    _findChildrenCategory(id) {
      findChildrenCategory(id).then((res) => {
        if (res.err_code === ERR_OK) {
          const data = res.data
          data.forEach((item) => {
            item.image = IMAGE_PREFIX + item.image
            item.children && item.children.forEach((child) => {
              child.image = IMAGE_PREFIX + child.image
            })
          })
          this.childrenCategoryList = data
        }
      })
    },
    /**
     * 顶级分类改变时
     */
    handleSidebarChange(index) {
      const id = this.rootCategoryList[index].id
      this._findChildrenCategory(id)
    }
  }
}
</script>

<style scoped lang="less">
.sidebar-container {
  position: absolute;
  top: 54px;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  background: #fff;

  .side-wrapper {
    flex: 0 0 86px;
    width: 86px;
    height: 100%;
    overflow: hidden;
    background: #f7f7f7;

    .sidebar {
      width: 100%;

      &--title {
        display: inline-block;
        width: 70px;
        white-space: pre-wrap;
      }
    }
  }

  .sidebar-content {
    flex: 1;
    overflow: hidden;

    .category-list-wrapper {
      .category-list {
        padding: 19px 7px 0;

        &__title {
          padding: 0;
          margin: 0;
          font-size: 14px;
          color: #333;
        }

        &__list {
          display: flex;
          flex-wrap: wrap;
          margin-top: 9px;
          padding: 7px 10px 0;

          &_list-item {
            flex: 0 0 33.333333333%;
            display: flex;
            flex-direction: column;
            align-items: center;

            img {
              display: block;
              width: 70px;
              height: 70px;
            }

            span {
              margin-top: 5px;
              height: 35px;
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
