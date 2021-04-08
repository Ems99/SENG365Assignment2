<template>
    <div>
		<div v-if="errorFlag" style="color: red;">
			{{ error }}
		</div>
		<div class="container"  id="profile">
            
		
			<br /><br />
			<div class="card card-sm">
				<div class="card-header d-flex bg-dark justify-content-between text-white">
                    <h1 class="h2">My Profile</h1>
					
                    <div>
                        
                        <router-link :to="{ name: 'edituser', params: {userId: userId}}">Edit</router-link>

                      
                    </div>
				</div>
				<div class="media-body">
					<div>
						<div class="card-text ml-2">
							<div class="row">
								<div class="col-3">
									<strong>Name</strong>
								</div>
								<div class="col-9">
									{{user.name}}
								</div>
							</div>

                            <div class="row">
								<div class="col-3">
									<strong>Email</strong>
								</div>
								<div class="col-9">
									{{user.email}}
								</div>
							</div>

                            <div class="row">
                                <div class="col-3">
                                    <strong>City</strong>
                                </div>
                                <div class="col-9">
                                    <div v-if="user.city !== null">
                                        <p>{{ user.city }}</p>
                                    </div>
                                </div>
                            </div>


                            <div class="row">
                                <div class="col-3">
                                    <strong>Country</strong>
                                </div>
                                <div class="col-9">
                                    <div v-if="user.country !== null">
                                        <p>{{ user.country }}</p>
                                    </div>
                                </div>
                            </div>


                            <div class="row">
                                <div class="col-3">
                                    <strong>Profile Picture</strong>
                                </div>
                                <div class="col-9">
                                   <img :src="getPhoto()" @error="imageLoadError" width="300px">
                                </div>
                            </div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
export default {
    data() {
        return {
            error: "",
			errorFlag: false,
        /*     name: "",
            email: "",
            city: "",
            country: "",
            photoFilename: "", */
            user: "",
            userId: ""
            

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
        getUserProfile() {

            this.userId = localStorage.getItem('userId');

            
            this.$http.get('http://localhost:4941/api/v1/users/' + localStorage.getItem('userId'), {headers: {'X-Authorization': localStorage.getItem('token')}})
            .then((response) => {
                this.user = response.data;
                console.log(this.user);

            })
            .catch((error) => {
				this.error = error;
				this.errorFlag = true;
			});
        },

        getPhoto: function() {
			return 'http://localhost:4941/api/v1/users/' + localStorage.getItem('userId') + '/photo'
		},


		imageLoadError () {
			event.target.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
		},
    }



}
</script>

