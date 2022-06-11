import { createStore } from 'vuex'
import { IUser } from '../types'

export default createStore({
  state: {
    user: {} as IUser,
  },
  getters: {
    user: (state) => state.user,
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
  },
  actions: {},
  modules: {},
})
