<template>
    <div class="container">
       
        <div v-if="errorFlag" style="color: red;">
            {{ error }}
        </div>
        <br />

        <!-- Example split danger button -->
        <div class="btn-group">
        

 
            <select name="filterByCategories" @change="onChange($event)" class="form-control" v-model="selectedCategory">
                    <option value="0">All</option>
                    <option value="1">Animals</option>
                    <option value="2">Environment</option>
                    <option value="3">Entertainment</option>
                    <option value="4">Human rights</option>
                    <option value="5">Immigration</option>
                    <option value="6">Justice</option>
                    <option value="7">Other</option>
            </select>
        </div>
        <div class="btn-group">

            <select name="sortBy" @change="onChange($event)" class="form-control" v-model="selectedSort">
                <option value="ALPHABETICAL_ASC">Alphabetical Asc</option>
                <option value="ALPHABETICAL_DESC">Alphabetical Desc</option>
                <option value="SIGNATURES_ASC">Signatures Asc</option>
                <option value="SIGNATURES_DESC">Signatures Desc</option>
            </select>

        </div>


			<div class="container" id="categories">
				
				
			</div>

            <br />

            <form class="form-inline">
				<input class="form-control mr-sm-2" v-model="titleSearched" type="search" placeholder="Search" aria-label="Search">
				<button class="btn btn-success my-2 my-sm-0" type="button" v-on:click="searchPetitionsbyTitle()">Search</button>
			</form>




			<hr>
			<div id="petitions" class="col">
				<div class="card card-sm">
					<div class="card-header d-flex bg-dark justify-content-between text-light">
						<div>
							<h1 class="h2">Petitions</h1>
						</div>
					</div>

					<ul class="list-group list-group-flush">
						<li class="list-group-item" v-for="petition in petitions" v-bind:key="petition.petitionId">

							<div class="media-body">
								<div class="d-flex justify-content-between mb-2">
									<div class="col-lg-5 col-xs-12">
										<img :src="getPhoto(petition.petitionId)" width="300px">
										<router-link :to="{ name: 'petition', params: {petitionId: petition.petitionId}}"><h2 class="h4">{{ petition.title }}</h2></router-link>
										<div>
										
										</div>
									</div>
								</div>
								<div class="ml-3">
                                    Category: {{ petition.category }} <br />
									Author: {{ petition.authorName }} <br />
									Signature Count: {{petition.signatureCount }}
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<!--end of col-->

			
			<ul class="pagination justify-content-center">
                <span claess="m-2">Page {{this.currentPage}} of  {{this.lastPage}}</span>
                <button :disabled="currentPage==1" class="btn btn-success m-2" type="button" v-on:click="getFirstPage()">First</button>
				<button :disabled="currentPage==1" class="btn btn-success m-2" type="button" v-on:click="getPreviousPage()">Previous</button>
				<button :disabled="currentPage==lastPage" class="btn btn-success m-2" type="button" v-on:click="getNextPage()">Next</button>
                <button :disabled="currentPage==lastPage" class="btn btn-success m-2" type="button" v-on:click="getLastPage()">Last</button>
			</ul>

            

	</div>
</template>

<script>
export default {

    data(){

        return{
            error: "",
            errorFlag: false,
            petitions: [],
            allPetitions: [],
            countPetitions: 0,
            currentPage:0,
            lastPage:0,
            numPerPage:10,
            titleSearched: "",
			selectedCategory:0,
			//selectedSort:"",
			selectedSort:"SIGNATURES_DESC",
			startIndex: 0
		}


    },

    mounted: function() {
		this.getPetitions();

	},

	    watch: {
      selectedSort: function(newSort)
      {
		this.searchPetitionsbyTitle();
		console.log(newSort);
	  },

	   selectedCategory: function(newCategory)
      {
		this.searchPetitionsbyTitle();
		console.log(newCategory);
      }
    },


    methods: {

        onChange(event) {
         console.log(event.target.value)
        },

        getFirstPage(){
            this.petitions = this.allPetitions.slice(0,this.numPerPage);
            this.currentPage=1;
        },


        getLastPage(){
            this.petitions = this.allPetitions.slice((this.lastPage*this.numPerPage)-this.numPerPage,this.lastPage*this.numPerPage);
            this.currentPage=this.lastPage;
        },

		getNextPage: function() {
			if(this.currentPage < this.lastPage) {
                this.petitions = this.allPetitions.slice(this.currentPage*this.numPerPage,(this.currentPage*this.numPerPage)+this.numPerPage);
                this.currentPage+=1;
			}
		},

		getPreviousPage: function() {
            if(this.currentPage > 1) {   
                this.currentPage-=1;             
                this.petitions = this.allPetitions.slice(this.currentPage*this.numPerPage-this.numPerPage,(this.currentPage*this.numPerPage));  
                console.log(this.currentPage*this.numPerPage-this.numPerPage);   
                console.log(this.currentPage*this.numPerPage);                 
            }
		},
        getPetitions: function() {

            this.$http.get('http://localhost:4941/api/v1/petitions/?startIndex=' + this.startIndex +'&count=999999999')
            .then((response) => {
                this.allPetitions = response.data;                
                this.countPetitions = this.allPetitions.length;
                this.petitions = this.allPetitions.slice(0,this.numPerPage);
                this.currentPage=1;
                this.lastPage = Math.ceil(this.countPetitions/this.numPerPage);
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




        searchPetitionsbyTitle: function() {
            console.log('here');
			//console.log(this.selectedCategory);
			var selectedCategory = parseInt(this.selectedCategory);
			//console.log(selectedCategory);
			var queryString = '';
			if(selectedCategory>0){queryString = '&categoryId=' + selectedCategory;}
			if(this.titleSearched !== "") {
            this.$http.get('http://localhost:4941/api/v1/petitions/?q=' + this.titleSearched + queryString + '&count=999999999')
            .then((response) => {

                this.allPetitions = response.data;                
                this.countPetitions = this.allPetitions.length;
                console.log('here 1');
                this.petitions = this.allPetitions.slice(0,this.numPerPage);
                this.currentPage=1;
                this.lastPage = Math.ceil(this.countPetitions/this.numPerPage);
            })
            .catch((error) => {
                this.error = error;
                this.errorFlag = true;
			});
			} else {
                console.log(this.selectedSort);
                console.log('here 2');

				  this.$http.get('http://localhost:4941/api/v1/petitions/?sortBy=' + this.selectedSort + queryString + '&count=999999999') 
            .then((response) => {
                this.allPetitions = response.data;                
                this.countPetitions = this.allPetitions.length;
                console.log('here 1');
                this.petitions = this.allPetitions.slice(0,this.numPerPage);
                this.currentPage=1;
                this.lastPage = Math.ceil(this.countPetitions/this.numPerPage);
            })
            .catch((error) => {
                this.error = error;
                this.errorFlag = true;
			});



			}
        },


        sortPetitions: function(sortBy) {

            switch(sortBy) {
                  case 'ALPHABETICAL_ASC':
                      break;
                  case 'ALPHABETICAL_DESC':
                      break;
                  case 'SIGNATURES_ASC':
                      break;
                  case 'SIGNATURES_DESC':
                      break;

                  default:
                  'SIGNATURES_DESC';
            }

            this.sortBy = sortBy;
            this.$http.get('http://localhost:4941/api/v1/petitions/?sortBy=' + this.sortBy)
            .then((response) => {
                this.petitions = response.data;
            })
            .catch((error) => {
                this.error = error;
                this.errorFlag = true;
            });
        }
    },
}
</script>