import { getAreaList } from '@/api/area'
import { ERR_OK } from '@/api/config'

const areaMixin = {
  data() {
    return {
      areaList: []
    }
  },
  mounted() {
    this._getAreaList()
  },
  methods: {
    showCascadePicker() {
      this.cascadePicker.show()
    },
    /**
     * 区域 Picker 选择
     * @param selectedVal
     * @param selectedIndex
     * @param selectedText
     */
    selectHandle(selectedVal, selectedIndex, selectedText) {
      this.address.area_id = selectedVal[selectedVal.length - 1]
      this.address.area_name = selectedText.join('')
      this.address.address = ''
    },
    cancelHandle() {

    },
    /**
     * 获取地区列表
     * @private
     */
    _getAreaList() {
      getAreaList().then((res) => {
        if (res.err_code === ERR_OK) {
          /**
           * 递归生成带有 children 属性的数组对象
           * @param data
           * @param root
           * @returns {[]}
           */
          const getChildren = function (data, root) {
            const children = []
            for (let i = 0; i < data.length; i++) {
              if (root === data[i].parent_id) {
                data[i].children = getChildren(data, data[i].id)
                children.push(data[i])
              }
            }
            return children
          }

          /**
           * 递归删除 children 为空的属性
           * @param arr
           * @returns {{length}|*}
           */
          const iterationDeleteMenuChildren = function (arr) {
            if (arr.length) {
              for (const i in arr) {
                if (arr[i].children.length) {
                  iterationDeleteMenuChildren(arr[i].children)
                } else {
                  delete arr[i].children
                }
              }
            }
            return arr
          }

          const cascadeData = getChildren(res.data, 0)
          iterationDeleteMenuChildren(cascadeData)

          this.cascadePicker = this.$createCascadePicker({
            title: '请选择地区',
            data: cascadeData,
            selectedIndex: [0, 0, 0],
            alias: {
              value: 'id',
              text: 'name'
            },
            onSelect: this.selectHandle,
            onCancel: this.cancelHandle
          })
        }
      })
    }
  }
}

export default areaMixin
