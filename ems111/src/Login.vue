<template>


<div class="container">
    <div class="row mb-5">
    </div>
    <!--end of row-->
    <div class="row justify-content-center">
    <div class="col-12 col-md-8 col-lg-7">
    <div class="card card-lg text-center">
    <div class="card-body">
    <div class="mb-5">
    <h1 class="h2 mb-2">Login</h1>
    <span>Sign in to your account to continue</span>
    </div>
    <div class="row no-gutters justify-content-center">
    <form v-on:submit.prevent="login()" class="text-left col-lg-8">
    <div class="form-group">
    <label for="login-email">Email Address<font color="red">*</font></label>
    <input required v-model="email" class="form-control form-control-lg" type="email" name="email" id="email" placeholder="Enter your Email Address" />

    </div>
    <div class="form-group">
    <label for="login-password">Password<font color="red">*</font></label>
    <input required v-model="password" class="form-control form-control-lg" type="password" name="password" id="password" placeholder="Enter your password" />
   
    </div>

    <div class="alert alert-danger" role="alert" v-if="invalidInput">
       {{this.invalid}}
    </div>
    
    <div class="text-center mt-3">
    <button type="submit" class="btn btn-lg btn-success">Login</button>
    </div>
    </form>
    </div>
    <!--end of row-->
    </div>
    </div>
    <div class="text-center">
    <span class="text-small">Don't have an account yet? <a href="/users/register"><strong>Create one</strong></a>
    </span>
    </div>
    </div>
    <!--end of col-->
    </div>
    <!--end of row-->
    </div>
    <!--end of container-->




</template>

<script>
export default {
    data(){
        return {
            email: "",
            password: "",
              //Login Variables
            loginUsername: "",
            loginPassword: "",
            loginEmail: "",
          
            invalid: "",
            invalidInput: ""
            //loggedIn: false
        }
    },

    mounted() {
    if(this.$store.state.authenticated){
      this.$router.push('/petitions');
    }
  }, 
    methods: {

    handleSubmit () {
      console.log("on submit");
    },

       login: function () {
            console.log("login func");
            let email = this.email;
            let password = this.password;
          
              let data = {'email': this.email, 'password': this.password};
              //  let jsonData = {"email": email, "password": password};  JSON.stringify(data)
                this.$http.post('http://localhost:4941/api/v1/users/login', data)//{"email": "johnwheaton@gmail.com", "password": "gossip"})
                //http://csse-s365.canterbury.ac.nz:4001/api/v1/users/login     works
               .then((response) => {
                 console.log('hi');

                  
                  if(response.status === 200) { 
                    console.log("hi");
                    localStorage.setItem("userId", response.data.userId);
                    localStorage.setItem("token", response.data.token);
                    //this.$store.state.authenticated = true;
                    this.$store.commit('login')
                    this.$router.push('/petitions'); 
                  }
              
                  
              
                  if(response.status == 400 || response.status == 500) {
                    console.log('help');
                    alert("Email or password may be incorrect");
                  } 
                })
                .catch((error) => {
  
                
                  this.invalid = "Invalid email/password supplied!";
                  this.invalidInput = true;
                  this.error = error;
                  this.errorFlag = true;
                  console.log(error);
            });
            
        }
    }
}
</script>