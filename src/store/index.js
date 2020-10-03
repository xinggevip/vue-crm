import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
// import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user:window.sessionStorage.getItem("user"),
  },
  mutations: {

    SET_USER: (state, data) => {
      window.sessionStorage.setItem('user', data)
    },
    LOGOUT: (state) => {
      state.user = null
      window.sessionStorage.removeItem('user')
    }
  },
  actions: {
  },
  modules: {
    app,
    settings,
    // user
  },
  getters
})

export default store
