<template>
	<div>
		<div v-if="errorFlag" style="color: red;">
			{{ error }}
		</div>
		<div class="container"  id="petition">
			<router-link :to="{ name: 'mypetitions'}">Back to My Petitions</router-link>
			<br /><br />
			<div class="card card-sm">
				<div class="card-header d-flex bg-dark justify-content-between text-light">
					<div>
						<h1 class="h2">Petition</h1>
                        
					</div>
                    <div v-if="new Date(petition.closingDate) > new Date()">
                        <router-link :to="{ name: 'edit', params: {petitionId: petition.petitionId}}">Edit</router-link>

                      
                    </div>
				</div>
				<div class="media-body">
					<div>
						<div class="card-text ml-2">
							<div class="row">
								<div class="col-3">
									<strong>Title:</strong>
								</div>
								<div class="col-9">
									{{ petition.title }}
								</div>
							</div>
							<div class="row">
								<div class="col-3">
									<strong>Description:</strong>
								</div>
								<div class="col-9">
									{{ petition.description }}
								</div>
							</div>

							
							<div class="row">
								<div class="col-3">
									<strong>Author:</strong>
								</div>
								<div class="col-9">
									{{ petition.authorName }}
								
								</div>
							</div>

							<div class="row">
								<div class="col-3">
									<strong>Author Photo:</strong>
								</div>
								<div class="col-9">
									<img :src="getAuthorPhoto(petition.authorId)" @error="imageLoadError" width="100px">
								
								</div>
							</div>


							<div class="row">
								<div class="col-3">
									<strong>Author City:</strong>
								</div>
								<div class="col-9" v-if="petition.authorCity !== null">
									{{ petition.authorCity }}
								
								</div>
							</div>

							<div class="row">
								<div class="col-3">
									<strong>Author Country:</strong>
								</div>
								<div class="col-9" v-if="petition.authorCountry !== null">
									{{ petition.authorCountry }}
								
								</div>
							</div>


							<div class="row">
								<div class="col-3">
									<strong>Hero Image:</strong>
								</div>
								<div class="col-9">
									<!-- put image here -->
									<img :src="getPhoto()" width="300px">
								</div>
							</div>

							<div class="row">
								<div class="col-3">
									<strong>Signature Count:</strong>
								</div>
								<div class="col-9">
									{{ petition.signatureCount }}
								</div>
							</div>

							<div class="row">
								<div class="col-3">
									<strong>Category:</strong>
								</div>
								<div class="col-9">
									{{ petition.category}}
								</div>
							</div>

							<div class="row">
								<div class="col-3">
									<strong>Created date:</strong>
								</div>
								<div class="col-9">
								<!-- 	{{ petition.createdDate}} -->
									{{moment.utc(this.petition.createdDate).local().format('YYYY-MM-DD')}}
								</div>
							</div>

							<div class="row">
								<div class="col-3">
									<strong>Closing date:</strong>
								</div>
								<div class="col-9">
									<div v-if="petition.closingDate !== null">
										<!-- {{ petition.closingDate }} -->
								        {{moment.utc(this.petition.closingDate).local().format('YYYY-MM-DD')}}
									</div>
									<div v-else>
										Closing date has not been set
									</div>
								</div>
							</div>
							<div class="row">
								<div class="col-3">
									<strong>Signatories:</strong>
								</div>
								<div class="col-9">
								  <button class="btn btn-success m-1" v-if="visible" v-on:click="showSignatories(petition.petitionId)">Hide Signatories</button>
								  <button class="btn btn-success m-1" v-if="!visible" v-on:click="showSignatories(petition.petitionId)">Show Signatories</button>
									<div v-if="visible">
										<div v-for="signatory in signatories" v-bind:key="signatory.signatoryId">
												<h4><strong>{{ signatory.name }}</strong></h4>
													<img :src="getSignatoryPhoto(signatory.signatoryId)" @error="imageLoadError" width="100px">
													<div v-if="signatory.city !== null">
														<p>City: {{ signatory.city }}</p>
													</div>
													<div v-if="signatory.country !== null">
														<p>Country: {{ signatory.country }}</p>
													</div>
										</div>
									</div>
								</div>
							</div>
							<div class="row mt-4 mb-3">
								<div class="col-3">
									<strong>Sharing:</strong>
								</div>
								<div class="col-9">
									<social-sharing v-bind:url="`http://canterbury.ac.nz/petitions/${pid}`"
										:title=petition.title
										:description=petition.description
										quote="Have a look at this petition"
										hashtags="petition, sign, share"
										twitter-user="twitter_user"
										inline-template>
										<div class="row">

											<network network="email">
												<i class="fa fa-envelope mr-3"></i>
											</network>


											<network network="facebook">
												<i class="fa fa-facebook mr-3"></i>
											</network>


											<network network="twitter">
												<i class="fa fa-twitter mr-3"></i>
											</network>

										</div>
									</social-sharing>
								</div>
							</div>
							<!--<button v-on:click="showSignatories()">Toggle hide and show</button> -->
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
			return{
				error: "",
				errorFlag: false,
				petition: "",  //Not sure if this should stay null, check to see if errors in console,
				visible: false,
				signatories: [],
				pid: ""
			}
		},

		mounted: function() {


			if(!this.$store.state.authenticated){
			this.$router.push('/users/login');
			} else {
				this.getSinglePetition();
			    this.pid = this.$route.params.petitionId;
	
			}
			
		},

		methods: {
			//maybe need error catching here??
			//take into account if don't have photo

		getAuthorPhoto: function(user_id) {
			return 'http://localhost:4941/api/v1/users/' + user_id + '/photo'
		},


		getPhoto: function() {
			return 'http://localhost:4941/api/v1/petitions/' + this.$route.params.petitionId + '/photo'
		},

		getSignatoryPhoto: function(user_id) {

			return 'http://localhost:4941/api/v1/users/' + user_id + '/photo'
		},

		imageLoadError () {
			event.target.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
		},

		showSignatories: function(petition_id) {
			this.visible = !this.visible;
			if (this.visible){
				 this.getSignatories(petition_id);
			}
		},

		getSinglePetition: function() {
			this.$http.get('http://localhost:4941/api/v1/petitions/' + this.$route.params.petitionId)
			.then((response) => {
				this.petition = response.data;

			})
			.catch((error) => {
				this.error = error;
				this.errorFlag = true;
			});
		},

		getSignatories: function(petition_id) {
			this.$http.get('http://localhost:4941/api/v1/petitions/' + petition_id + '/signatures')
			.then((response) => {
				this.signatories = response.data;
			})
			.catch((error) => {
				this.error = error;
				this.errorFlag = true;
			});
		}
	}
}

</script>