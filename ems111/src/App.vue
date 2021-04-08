<template>
 <div id="app">
   <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
		<!-- Navbar content -->
		<a class="navbar-brand" href="#">PetitioNZ</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">t
      <li class="nav-item active">
        <a class="nav-link mt-1" href="/">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link mt-1" href="/petitions">Petitions</a>
	  </li>

    <div v-if="this.$store.state.authenticated" >
      <li class="nav-item">
        <a class="nav-link mt-1" href="/mypetitions">My Petitions</a>
	  </li>

    </div>

    <div v-if="this.$store.state.authenticated">
      <li class="nav-item">
        <a class="nav-link mt-1" href="/users/viewuser">My Profile</a>
      </li>
    </div>
	</ul>
    
    <form class="login-buttons my-2 my-lg-0">
     <div v-if="this.$store.state.authenticated">
         <router-link class="btn btn-outline-success my-2 my-sm-0 mr-2" to="/users/logout">Logout</router-link>
         
    </div>

    <div v-else>
        <router-link class="btn btn-outline-success my-2 my-sm-0 mr-2" to="/users/login">Login</router-link>
        <router-link class="btn btn-outline-success my-2 my-sm-0 mr-2" to="/users/register">Register</router-link>
    </div>   
     
    </form>
  </div>
	  </nav>     
    <router-view />
  </div>
</template>
<script>


export default {
  name: 'app',
 
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      
    }  
  },

  mounted(){
    if (this.$store.state.token){
      this.$store.state.authenticated = true;
    }
  },

  methods:
  { 

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 0px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.bg-secondary {
  color: #e9ecef;
}
</style>
