<template>
    <div>
        <div v-if="errorFlag" style="color: red;">
            {{ error }}
        </div>
			
			<hr>
			<div id="petitions" class="col">
				<div class="card card-sm">
					<div class="card-header d-flex bg-dark justify-content-between text-light">
						<div>
							<h1 class="h2"> My Petitions</h1>
                             
						</div>
                        <div>
                        <router-link :to="{ name: 'add' }">Add Petition</router-link>

                      
                    </div>
					</div>

					<ul class="list-group list-group-flush">
						<li class="list-group-item" v-for="(petition, index) in petitions" v-bind:key="petition.petitionId">
							<div class="media-body">
								<div class="d-flex justify-content-between mb-2">
									<div class="row">
                                        <div class="col-lg-5 col-xs-12">
                                            <img :src="getPhoto(petition.petitionId)" width="300px">
                                            <router-link :to="{ name: 'mypetition', params: {petitionId: petition.petitionId}}"><h2 class="h4">{{ petition.title }}</h2></router-link>
                                        </div>
                                        
                                        <div class="col-2">
                                            Category: {{ petition.category }}
                                        </div>
                                        <div class="col">
                                            Author: {{ petition.authorName }} <br />
                                        </div>
                                        <div class="col" mr-0>
                                            Count: {{petition.signatureCount }}
                                        </div>
                                        <div class="col text-left">
                                            <button class="btn btn-success" type="button"  @click="deletePetition(petition.petitionId,index)">Delete</button>
                                        </div>                                            
									</div>
								</div>
								<div>							
                        
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<!--end of col-->



	</div>
</template>

<script>
export default {

    data(){

        return{
            error: "",
            errorFlag: false,
			petitions: []
		}


    },


    mounted: function() {
         if(!this.$store.state.authenticated){
            this.$router.push('/users/login');
        } else {
            this.getPetitions();
        }
	},

    methods: {


        getPetitions: function() {


            this.$http.get('http://localhost:4941/api/v1/petitions/?authorId=' + localStorage.getItem('userId'))
            .then((response) => {
                this.petitions = response.data;
            })
            .catch((error) => {
                this.error = error;
                this.errorFlag = true;
            });
		},

        getPhoto: function(petition_id) {
			return 'http://localhost:4941/api/v1/petitions/' + petition_id + '/photo'
		},

		/* getSinglePetition: function(petition_id){
			this.$http.get('http://localhost:4941/api/v1/petitions/' + petition_id)
            .then((response) => {
				this.petitions = response.data;

            })
            .catch((error) => {
                this.error = error;
                this.errorFlag = true;
            });
        }, */
        
        deletePetition: function(petition_id,index) {
            //check allowed to delete
            
             this.$http.delete('http://localhost:4941/api/v1/petitions/' + petition_id, {headers: {'X-Authorization': localStorage.getItem('token')}})
            .then((response) => {
                //console.log(petition_id,this.petitions);
                this.petitions.splice(index, 1); 
            })
            .catch((error) => {
                this.error = error;
                this.errorFlag = true;
            });

        }
    },
}
</script>