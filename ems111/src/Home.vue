<template>

  <div>
		<div v-if="errorFlag" style="color: red;">
			{{ error }}
		</div>
		<div class="container"  id="profile">
            
		
			<br /><br />
			<div class="card card-sm">
				<div class="card-header d-flex bg-dark justify-content-between text-white">
                    <h2 class="h2">Welcome to PetitioNZ!</h2>
					
    
				</div>
				<div class="media-body">
					<div>
						<div class="card-text ml-2 mt-3 mb-3">
							<div>
							<h3>Petitions</h3>
							<router-link :to="{ name: 'petitions'}">View Petitions</router-link>
						    </div>

							<div v-if="this.$store.state.token">
								<h3>My Petitions</h3>
								<router-link :to="{ name: 'mypetitions'}">View My Petitions</router-link>

							</div>

							<div v-if="this.$store.state.token">
								<h3>My Profile</h3>
								<router-link :to="{ name: 'viewuser'}">View My Profile</router-link>


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
			errorFlag:""
		}
	}
}
</script>


<!--- search on homepage-->
