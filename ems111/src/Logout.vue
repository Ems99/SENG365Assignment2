<template>




</template>

<script>
export default {

  mounted(){    
     if(!this.$store.state.authenticated){
      this.$router.push('/petitions');
    }
    else {
      this.logout();
    }
  },

  methods:{
    logout: function() {

      this.$http.post('http://localhost:4941/api/v1/users/logout', '' , {headers: {'X-Authorization': localStorage.getItem('token')}})
      .then((response) => {
        
      if(response.status === 200) {        
        
        this.$store.commit('logout')
        localStorage.removeItem("userId", response.data.userId);
        localStorage.removeItem("token", response.data.token);

        this.$router.push("/users/login");
        } else {
          alert("something went wrong");
        }
        

      }) 
      .catch((error) => {
              
                    this.error = error;
                    this.errorFlag = true;
                    console.log(error);
              });

    }
  }
  
}
</script>
