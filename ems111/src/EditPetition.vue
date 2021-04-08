<template>

<div class="container">
<br><br>
    <form id="form1" v-on:submit.prevent="editPetition()" name="form1" method="post" enctype="multipart/form-data">
       
        <div class="form-group">
            <label for="title">Title</label>
            <input v-model="petition.title" type="text" name="title" id="title" class="form-control">
        </div>
        
        <div class="form-group">
            <label for="description">Description</label>
            <input v-model="petition.description" type="text" name="description" id="description" class="form-control">
        </div>

       <div class="form-group">
             <label for="category">Category</label>

             <select class="form-control" id="category" v-model="petition.category">
                 <option v-for="category in categories" v-bind:key="category.categoryId">
                     {{category.name}}
                </option>
                <!--:selected="petition.categoryId == 1"-->
            </select>
        </div>


    <div class="container">
        <div class="large-12 medium-12 small-12 cell">
        <label>File
            <input type="file" id="file" ref="file" accept="image/png, image/jpeg, image/gif" v-on:change="handleFileUpload()"/>
         </label>

        </div>
     </div>


        <!-- closing date optional... must be in future -->

      <div class="date-picker">
            <date-picker v-model="petition.closingDate" name="time1" id="time1" valueType="format" :disabled-date="notBeforeToday"></date-picker>
          <label for="closingDate">Closing Date</label>
        <!--   <div>

          <date-picker v-model="closingDate" type="datetime" :disabled-date="notBeforeToday"></date-picker>
          </div> -->
      </div>

      <div class="text-center mt-3">
    <button type="submit" class="btn btn-lg btn-success">Edit Petition</button>
    </div>
    </form>
</div>


    
    

</template>


<script>

const today = new Date();
//today.setHours(0, 0, 0, 0);


  import DatePicker from 'vue2-datepicker';
  import 'vue2-datepicker/index.css';
  import moment from 'moment';
export default {

        components: { DatePicker },

  data () {
    return {
        closingDate: new Date() , //null
        url: null,
        image: {
                "file": null,
                "imgName": "profile image",
                "type": null,
                "url": false
            },

        title: "",
        description: "",
        categoryId: "",
        //closingDate:"",
        //time1: new Date()
        time1: null, 
        errorMsg: "",
         petition: [],
          file: "",
          categories: []
    }
    },

    mounted: function() {
        if(!this.$store.state.authenticated){
            this.$router.push('/users/login');
        } else {
            this.getPetition();
            this.getCategories();
        }
	},
    methods:  {

        getCategories: function() {
            this.$http.get('http://localhost:4941/api/v1/petitions/categories')
			.then((response) => {
                this.categories = response.data;
            
			})
			.catch((error) => {
				this.error = error;
				this.errorFlag = true;
			});

        },

          handleFileUpload() {
            this.file = this.$refs.file.files[0];
        },

        getPetition: function() {
            	this.$http.get('http://localhost:4941/api/v1/petitions/' + this.$route.params.petitionId)
			.then((response) => {
                this.petition = response.data;
                this.petition.closingDate = moment.utc(this.petition.closingDate).local().format('YYYY-MM-DD');
                console.log(this.petition);
			})
			.catch((error) => {
				this.errorMsg = error;
				this.errorFlag = true;
			});

        },


         onFileChange(e) {
            const file = e.target.files[0];
            this.url = URL.createObjectURL(file);
         },
        notBeforeToday(date) {
            return date < today;
        },

        editPetition: function() {
           // let categoryId = parseInt(this.petition.categoryId);
            //console.log(categoryId);
        
            let petitionData = {};

            if(this.petition.title !== "") {
                petitionData["title"] = this.petition.title;
            }
            if(this.petition.description !== "") {
                petitionData["description"] = this.petition.description;
                console.log(this.description);
            }
            if(this.petition.category !== "") {
                
                var category;
                for (category of this.categories) {
                    if(this.petition.category == category.name) {
                         petitionData["categoryId"] = parseInt(category.categoryId);
                    }
                }
               
            }
            console.log(this.time1);

            if(this.petition.closingDate !== null) {
                //time1.toISOString();
                //let time1 = this.time1;
                //time1 = time1.getTime() - time1.getTimezoneOffset() * 60 * 1000;
                petitionData["closingDate"] = moment.utc(this.petition.closingDate).local().format('YYYY-MM-DD'); //new Date(this.petition.closingDate);
                console.log(petitionData["closingDate"]);
                //console.log(this.time1);
            }
            
            console.log(petitionData);
/* 
            let petitionData = {
                "title": this.title,
                "description": this.description,
                "categoryId": categoryId,
                "closingDate": this.time1 

            }; */

            


            this.$http.patch('http://localhost:4941/api/v1/petitions/' + this.$route.params.petitionId, petitionData, {headers: {'X-Authorization': localStorage.getItem('token')}})
            .then((response) => {
                    console.log(response);
                let petitionId = response.data.petitionId;
                console.log(petitionId);
                //console.log(response.data.id);
                if(this.file !== "") {

                   this.$http.put('http://localhost:4941/api/v1/petitions/' + this.$route.params.petitionId + '/photo',
                this.file,
                {
                headers: {
                   'Content-Type': this.file.type,
                   'X-Authorization': localStorage.getItem('token')
                }
               });
             }

                if(response.status === 200) {
                    this.$router.push('/mypetitions/' + this.$route.params.petitionId);
                    
                }
/* 
                 let project_id = response.data.id;
                            if (this.image) {
                                this.updateImage(project_id)
                            }
                            logic like this for my image
 */
            })
            .catch((error) => {
                console.log(error);
                this.error = error;
                this.errorFlag = true;

            });
        }

       

 
  }
}
</script>

