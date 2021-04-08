<template>

<div class="container">
<br><br>
    <form id="form1" v-on:submit.prevent="editUser()" name="form1" method="post" enctype="multipart/form-data">
       <div v-if="errorMsg">ERROR</div>
        <div class="form-group">
            <label for="name">Name</label>
            <input v-model="user.name" type="text" name="name" id="name" class="form-control">
        </div>
        
        <div class="form-group">
            <label for="email">Email Address</label>
            <input v-model="user.email" type="email" name="email" id="email" class="form-control">
        </div>


        <div class="form-group">
            <label for="city">City</label>
            <input v-model="user.city" type="text" name="city" id="city" class="form-control">
        </div>

        <div class="form-group">
            <label for="country">Country</label>
            <input v-model="user.country" type="text" name="country" id="country" class="form-control">
        </div>

        <div class="form-group">
            <label for="currentPassword">Current Password (required only if changing password)</label>
            <input v-model="currentPassword" type="password" name="currentPassword" id="currentPassword" class="form-control">
        </div>

        <div class="form-group">
            <label for="newPassword">New Password</label>
            <input v-model="newPassword" type="password" name="newPassword" id="newPassword" class="form-control">
        </div>

         <div class="container">
    <div class="large-12 medium-12 small-12 cell">
      <label>File
        <input type="file" id="file" ref="file" accept="image/png, image/jpeg, image/gif" v-on:change="handleFileUpload()"/>
      </label>

      <button class="btn btn-success" type="button" @click="deletePhoto()">Delete Photo</button>

    </div>
  </div>

   <div class="alert alert-danger" role="alert" v-if="invalidInput">
       {{this.invalid}}
   </div>
       
 

      <div class="text-center mt-3">
    <button type="submit" class="btn btn-lg btn-success">Edit User</button>
    </div>
    </form>
       
</div>    
    

</template>


<script>
export default {
    data(){
        return{
            url: null,
            name: "",
            email: "",
            city: "",
            country: "",
             image: {
                "file": null,
                "imgName": "profile image",
                "type": null,
                "url": false
            },
            newPassword: "",
            currentPassword: "",
            user: [],
            errorMsg : "",
             file: "",
              invalid: "",
            invalidInput: ""
        }


    },

      mounted: function() {
           if(!this.$store.state.authenticated){
            this.$router.push('/users/login');
        } 
        else {
            this.getUserProfile();
        }   
	},

    methods: {

         handleFileUpload() {
            this.file = this.$refs.file.files[0];
        },

        getUserProfile() {            

            this.userId = localStorage.getItem('userId');
            console.log('getUserProfile')

            
            this.$http.get('http://localhost:4941/api/v1/users/' + localStorage.getItem('userId'), {headers: {'X-Authorization': localStorage.getItem('token')}})
            .then((response) => {
                this.user = response.data;
            })
            .catch((error) => {
				this.errorMsg = error;
				this.errorFlag = true;
			});
        },

        getPhoto: function() {
			return 'http://localhost:4941/api/v1/users/' + localStorage.getItem('userId') + '/photo'
		},

          onFileChange(e) {
            const file = e.target.files[0];
            this.url = URL.createObjectURL(file);
         },

         imageLoadError () {
			event.target.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
		},

         deletePhoto: function() {

             this.$http.delete('http://localhost:4941/api/v1/users/' + localStorage.getItem('userId') + '/photo', {headers: {'X-Authorization': localStorage.getItem('token')}})
			.then((response) => {
                if(response.status == 200) {
                      this.imageLoadError();
                      this.$router.push('/users/viewuser');  //should I do this?

                }

			})
			.catch((error) => {
				console.log(error);
				this.error = error;
				this.errorFlag = true;
			});

             

         },


        editUser: function() {
        let userData = {};

        if(this.user.name !== "") {
            userData["name"] = this.user.name;
        }

        if(this.user.email !== "") {
            userData["email"] = this.user.email;
        }

        if(this.user.city !== "") {
            userData["city"] = this.user.city;
        }

        if(this.user.country !== "") {
            userData["country"] = this.user.country;
        }

        if(this.newPassword !== "") {
            userData["password"] = this.newPassword;
        }

        if(this.currentPassword !== "") {
            userData["currentPassword"] = this.currentPassword;
        }
        
        //console.log(userData);

        this.$http.patch('http://localhost:4941/api/v1/users/' + localStorage.getItem('userId'), userData, {headers: {'X-Authorization': localStorage.getItem('token')}})
        .then((response) => {
            //let userId = response.data.userId;
            console.log(response);
            console.log(userData);
            console.log(localStorage.getItem('userId'));


            
                this.$http.put('http://localhost:4941/api/v1/users/' + localStorage.getItem('userId') + '/photo',
                this.file,
                    {
                    headers: {
                        'Content-Type': this.file.type,
                        'X-Authorization': localStorage.getItem('token')
                    }
                });

            if(response.status === 200) {
                this.$router.push('/users/viewuser');
            }
        })
        .catch((error) => {
            this.invalid = "Email may already be in use OR incorrect password supplied!";  
            this.invalidInput = true;
                      
            
                this.error = error;
                this.errorFlag = true;

            });
    }
    }

    
}
</script>