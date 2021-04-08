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
    <h1 class="h2 mb-2">Create Your Account</h1>
    <span>Fill in this form to create an account with us</span>
    </div>
    <div class="row no-gutters justify-content-center">
    <form v-on:submit.prevent="register()" class="text-left col-lg-8">

    <div class="form-group">
    <label for="name">Name<font color="red">*</font></label>
    <input required v-model="name" class="form-control form-control-lg" type="name" name="name" id="name" placeholder="Name" />
    </div>

    <div class="form-group">
    <label for="email">Email Address<font color="red">*</font></label>
    <input required v-model="email" class="form-control form-control-lg" type="email" name="email" id="email" placeholder="Email Address" />

    </div>
    <div class="form-group">
    <label for="password">Password<font color="red">*</font></label>
    <input required v-model="password" class="form-control form-control-lg" type="password" name="password" id="password" placeholder="Enter a password" />

    <div class="form-group">
    <label for="city">City</label>
    <input v-model="city" class="form-control form-control-lg" type="city" name="city" id="city" placeholder="City" />
    </div>

    <div class="form-group">
    <label for="city">Country</label>
    <input v-model="country" class="form-control form-control-lg" type="country" name="country" id="country" placeholder="Country" />
    </div>

    



      <div class="container">
    <div class="large-12 medium-12 small-12 cell">
      <label>Profile Picture
        <input type="file" id="file" ref="file" accept="image/png, image/jpeg, image/gif" v-on:change="handleFileUpload()"/>
      </label>

    </div>
  </div>
    </div>

    <div class="alert alert-danger" role="alert" v-if="invalidInput">
       {{this.invalid}}
</div>
    <div class="text-center mt-3">
    <button type="submit" class="btn btn-lg btn-success">Register</button>
    </div>
    </form>
    </div>
    <!--end of row-->
    </div>
    </div>
    <div class="text-center">
    <span class="text-small">Already have an account? <a href="/users/login"><strong>Login here</strong></a>
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
        return{
            url: null,

            name: "",
            email: "",
            password: "",
            city: "",
            country: "",
            file: "",
            invalidLogin: false,
            invalid: "",
            invalidInput: ""

        }
    },

    methods: {
        handleFileUpload() {
            this.file = this.$refs.file.files[0];
        },

         register: function() {

             if(this.city == "" && this.country == "") {
                var data = {'name': this.name,'email': this.email, 'password': this.password};
                 

             }
             else if(this.city == "" && this.country !== "") {
                 var data = {'name': this.name,'email': this.email, 'password': this.password, 'country': this.country};

             }

            else if(this.country == "" && this.city !== "") {
                 var data = {'name': this.name,'email': this.email, 'password': this.password, 'city': this.city};
                 

             } else {
                var data = {'name': this.name,'email': this.email, 'password': this.password, 'city': this.city, 'country': this.country};

             }
              
               this.$http.post('http://localhost:4941/api/v1/users/register', data)
                .then((response) => {
                    console.log(response);

                 //this.loggedInUserId = response.body.id;
                  let userId = response.data.userId;


                        this.invalid ="Email may already be in use!";
                       

                   // if(response.status === 200) {this.$router.push('/petitions'); }
                        if(response.status == 400) {
                            this.invalid = "Email may already be in use!";
                            alert("Email may already be in use");
                        }
                    }) //end then
                    .catch((error) => {

                    this.invalid = "Email may already be in use!";
                           this.invalidInput = true;
                      
                           
                        

                        this.invalidLogin = true;
                        this.error = error;
                        this.errorFlag = true;
                    })//end catch

                    .then((response) => {

                        if(!this.invalidLogin) {
                            this.$http.post('http://localhost:4941/api/v1/users/login', {
                            "email": this.email,
                            "password": this.password})
                            .then((response) => {
                                localStorage.setItem("userId", response.data.userId);
                                localStorage.setItem("token", response.data.token);
        

                                  this.$http.put('http://localhost:4941/api/v1/users/' + localStorage.getItem('userId') + '/photo',
                            this.file,
                             {
                                headers: {
                                    'Content-Type': this.file.type,
                                    'X-Authorization': localStorage.getItem('token')
                                }
                            });


                                this.$router.push('/petitions');

                            }); //end then response        
                        } //end if                
                });//end post then
            //}
         } //register end
    } //method end
} //export end
</script>

<style>
.fa {
    font-size: 12px;
}


</style>