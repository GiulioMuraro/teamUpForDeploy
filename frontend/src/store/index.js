import { createStore } from 'vuex'

// Crea una nuova istanza dello store.
const store = createStore({
  state() {
    return {
      user: "",
      email: "",
      token: ""
    }
  },
  mutations: {
    // payload: { user: {}, email: "", token: "" }
    setToken(state, payload) {
      state.user = payload.user;
      state.email = payload.email;
      state.token = payload.token;

      // Salva le informazioni di login in localStorage
      localStorage.setItem('loginInfo', JSON.stringify(payload));
    },
    // Cancella le informazioni di login
    clearToken(state) {
      state.user = "";
      state.email = "";
      state.token = "";

      // Rimuovi le informazioni di login da localStorage
      localStorage.removeItem('loginInfo');
    },
    updateUser(state, payload) {
      state.user = payload.user;
      state.email = payload.email;

      const loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
      if (loginInfo) {
        loginInfo.user = payload.user;
        loginInfo.email = payload.email;
        localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
      }
    },
  },
  actions: {
    // Azione per inizializzare lo store con le informazioni di login da localStorage
    initializeStore({ commit }) {
      const loginInfo = localStorage.getItem('loginInfo');
      if (loginInfo) {
        const { user, email, token } = JSON.parse(loginInfo);
        commit('setToken', { user, email, token });
      }
    },
    // Logout action to clear token and user information
    logout({ commit }) {
      commit('clearToken');
    },
    updateUser({ commit }, payload) {
      commit('updateUser', payload);
    },
  },
  getters: {
    getToken: state => {
      return state.token;
    },
    getUser: state => {
      return state.user;
    },
    getEmail: state => {
      return state.email;
    },
  }
});

// Inizializza lo store quando l'applicazione parte
store.dispatch('initializeStore');

export default store;
