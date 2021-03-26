const address = {
  state: {
    isUpdate: false
  },
  getters: {
    isAddressUpdate: state => state.isUpdate
  },
  mutations: {
    SET_ADDRESS_IS_UPDATE: (state, bool) => {
      state.isUpdate = bool
    }
  },
  actions: {
    /**
     * 设置地址更新状态
     * @param commit
     * @param bool
     * @returns {Promise<unknown>}
     * @constructor
     */
    SetAddressIsUpdate({ commit }, bool) {
      return new Promise(resolve => {
        commit('SET_ADDRESS_IS_UPDATE', bool)
        resolve()
      })
    }
  }
}

export default address
