import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({


    state: {    
        token: localStorage.getItem('token') || '',
        authenticated: localStorage.getItem('token')
    },

    mutations: {
        auth(state, token) {
            state.token = token;
        },
        logout(state) {
            state.token = '';
            state.authenticated = false;
            localStorage.clear('token');
        },
        login(state) {
            state.authenticated = true;
        }

    }

});