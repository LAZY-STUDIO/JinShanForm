import { createStore } from 'vuex'
import { IUser } from '../types'

export default createStore({
  state: {
    user: {} as IUser,
    show: 0,
  },
  getters: {
    user: (state) => state.user,
    // show: (state) => state.show,
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    // showAction(state, params) {
    //   state.show = params
    // },
  },
  actions: {},
  modules: {},
})
