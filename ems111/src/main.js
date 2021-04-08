import Vue from 'vue';
import App from './App.vue';
import Home from './Home.vue';
import Petitions from './Petitions.vue';
import Petition from './Petition.vue';
import Login from './Login.vue';
import Register from './Register.vue';
import VueRouter from 'vue-router';
import moment from 'moment'; 

import Logout from './Logout.vue';
import CreatePetition from './CreatePetition.vue';
import MyPetitions from './MyPetitions.vue';
import MyPetition from './MyPetition.vue';
import EditPetition from './EditPetition.vue';
import User from './User.vue';
import ViewUser from './ViewUser.vue';
import EditUser from './EditUser.vue';


Vue.use(VueRouter);
Vue.prototype.moment = moment;
import axios from 'axios';
import VueAxios from 'vue-axios';
Vue.use(VueAxios, axios);
import store from './store.js';

const SocialSharing = require('vue-social-sharing');
Vue.component('social-sharing', SocialSharing)

const routes = [
	{
		path: "/",
		name: 'home',
		component: Home
	},
	{
		path: "/petitions",
		name: "petitions",
		component: Petitions
	},
	{ 

		path: "/mypetitions/add",
		name: "add",
		component: CreatePetition
	},
	{
		path: "/mypetitions/:petitionId/edit",
		name: "edit",
		component: EditPetition
	},

	{
		path: "/petitions/:petitionId",
		name: "petition",
		component: Petition
	},
	{
		path: "/mypetitions",
		name: "mypetitions",
		component: MyPetitions
	},

	{
		path: "/mypetitions/:petitionId",
		name: "mypetition",
		component: MyPetition
	},

	{
		path:"/users/login",
		name: "login",
		component: Login
	},
	{
		path:"/users/logout",
		name: "logout",
		component: Logout
	},

	{

		path: "/users/register",
		name: "register",
		component: Register
	},

	{
		path: "/users/user",
		name: "user",
		component: User
	},
	{
		path: "/users/viewuser",
		name: "viewuser",
		component: ViewUser

	},
	{
		path: "/users/edituser",
		name: "edituser",
		component: EditUser
	}



];

const router = new VueRouter({
	routes: routes,
	mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  store,
  render: h => h(App)
});
