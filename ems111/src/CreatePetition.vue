<template>

<div class="container">
<br><br>
    <form id="form1" v-on:submit.prevent="addPetition()" name="form1" method="post" enctype="multipart/form-data" action="<?php echo  $form_action; ?>">
       
        <div class="form-group">
            <label for="title">Title<font color="red">*</font></label>
            <input required v-model="title" type="text" name="title" id="title" class="form-control">
        </div>
        
        <div class="form-group">
            <label for="description">Description<font color="red">*</font></label>
            <input required v-model="description" type="text" name="description" id="description" class="form-control">
        </div>

       <div class="form-group">
             <label for="categoryId">Category<font color="red">*</font></label>

             <select class="form-control" id="category" v-model="categoryId">
                 <option v-for="category in categories" v-bind:key="category.categoryId"  :value="category.categoryId">
                     {{category.name}}
  
                </option>
                <!--:selected="petition.categoryId == 1"-->
            </select>
         
<!-- 
             <select class="form-control" id="exampleFormControlSelect1" v-model="categoryId">
                <option value=1>Animals</option>
                <option value=2>Environment</option>
                <option value=3>Entertainment</option>
                <option value=4>Human Rights</option>
                <option value=5>Immigration</option>
                <option value=6>Justice</option>
                <option value=7>Other</option>
            </select> -->
        </div>


      <div class="container">
    <div class="large-12 medium-12 small-12 cell">
      <label>Hero Image<font color="red">*</font>
        <input required type="file" id="file" ref="file" accept="image/png, image/jpeg, image/gif" v-on:change="handleFileUpload()"/>
      </label>

    </div>
  </div>

 


        <!-- closing date optional... must be in future -->

      <div class="date-picker">
            <date-picker v-model="time1" name="time1" id="time1" valueType="format" :disabled-date="notBeforeToday"></date-picker>
          <label for="closingDate">Closing Date</label>
        <!--   <div>

          <date-picker v-model="closingDate" type="datetime" :disabled-date="notBeforeToday"></date-picker>
          </div> -->
      </div>

      <div class="text-center mt-3">
    <button type="submit" class="btn btn-lg btn-success">Create Petition</button>
    </div>
    </form>



        

        
        
       

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
        categoryId:null,
        //closingDate:"",
        time1: new Date(),
        file: "",
        categories: []

     
    }
    },

    mounted: function() {
        if(!this.$store.state.authenticated){
            this.$router.push('/users/login');
        } else {
          this.getCategories();
        }      
	},

    
    methods: {
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
           
         onFileChange(e) {
            const file = e.target.files[0];
            this.url = URL.createObjectURL(file);
         },
        notBeforeToday(date) {
            return date < today;
        },

        addPetition: function() {
            
             let categoryId = parseInt(this.categoryId);


            if(moment.utc(this.time1).local().format('YYYY-MM-DD') == moment.utc(new Date()).local().format('YYYY-MM-DD') ) {
              var petitionData = {
                "title": this.title,
                "description": this.description,
                "categoryId": categoryId
                };


            } else {

              var petitionData = {
                "title": this.title,
                "description": this.description,
                "categoryId": categoryId,
                "closingDate": moment.utc(this.time1).local().format('YYYY-MM-DD') //this.time1 //"2021-01-01 18:25:43.511"
            };
             
            }

           

          

            console.log(petitionData);
            console.log(this.file);

           

            this.$http.post('http://localhost:4941/api/v1/petitions', petitionData, {headers: {'X-Authorization': localStorage.getItem('token')}})
            .then((response) => {
                    console.log(response);
                let petitionId = response.data.petitionId;
                console.log(petitionId);
                //console.log(response.data.id);
                  this.$http.put('http://localhost:4941/api/v1/petitions/' + petitionId + '/photo',
                this.file,
                {
                headers: {
                   'Content-Type': this.file.type,
                   'X-Authorization': localStorage.getItem('token')
                }
               });
          

                if(response.status === 201) {
                    this.$http.post('http://localhost:4941/api/v1/petitions/' + petitionId + '/signatures', "", {headers: {'X-Authorization': localStorage.getItem('token')}});
                     this.$router.push('/mypetitions');    
                
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

