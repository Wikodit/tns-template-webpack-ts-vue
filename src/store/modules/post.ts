const state = {

}

const getters = {

}

const actions = {
  async autoSync({ dispatch, state }, counter) {
    // run every 1 minute (6 * 10sec)
    if (counter % 6) {
      console.log('hé hooo')
      dispatch('entities/posts/fetch', { endpoint: 'posts' })
    }
  },

  /**
   * Fetch user from api
   */
  // async fetchUser({ commit }, options: ApiOptions = {}) {
  //   const { body } = await get('posts', options)
  //   if (body) commit('setEvents', data)
  // }
}

const mutations = {

}


export default { state, getters, actions, mutations }