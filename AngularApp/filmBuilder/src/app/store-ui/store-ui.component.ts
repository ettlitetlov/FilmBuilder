import { Component, OnInit} from '@angular/core';
import { Entry } from "../entry";
import { StoreService } from "../store.service";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-store-ui',
  templateUrl: './store-ui.component.html',
  styleUrls: ['./store-ui.component.css']
})
export class StoreUIComponent implements OnInit {

  constructor(private storeService: StoreService) { }
  selectedFile: File = null;
  public successMessage: string = null;
  model = new Entry('','','','') 
  public categories: any[] = [];
  public categories2: any[] = [];
  public keys: any[] = [];
  public length: any[] = [];
  public selectedCategory: string[];
  startvalue: boolean = false;

  ngOnInit() { 

    // Populate category list from server
    this.storeService.fetchCategories().subscribe(data => {
    //Fetch first key-word in the object, this is a formality to avoid errors, could use just category, since its a key in the data-object.
    const category = Object.keys(data)[0];

    var i = 0;
    data[category].forEach(element => {
      this.categories.push(Object.keys(element));               //<- Original

      Object.values(element).forEach(subElement => {

        Object.keys(subElement).forEach(test => {
          var obj = {};
          var name = test;
          var tmpArr = new Array();
          Object.values(subElement[test]).forEach(subSubElement =>{
            Object.values(subSubElement).forEach(superSubElement => {
                if(superSubElement.type === "Video"){
                  tmpArr.push(superSubElement.name);
                }
            })
          })

          obj[name] = tmpArr;
          this.categories2.push(obj); 
        });
        this.categories[i].push(Object.keys(subElement));       //<- Original
        i++;
      })

    });
    for(var i = 0; i < this.categories2.length;i++){
      this.keys[Object.keys(this.categories2[i]).toString()] = Object.values(this.categories2[i]);
      this.length.push(i);
    }
    console.log(this.keys);
   })
   console.log(this.categories2);
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }

  onCategorySelected(event){
      this.selectedCategory = this.model.category.split("/",2);
      console.log(document.getElementById("name2"));
  }

  languages = ['Swedish', 'English', 'Arabic', 'Spanish', 'French', 'German'];

  types = ['Video', 'Audio', 'Subtitles'];

  onSubmit(form: NgForm){
    // Construct a formdata for file upload
    let formData = new FormData();

    formData.append("type", this.model.type);
    formData.append("name", this.model.name);
    formData.append("category", this.model.category);
    if(this.model.language)
      formData.append("language", this.model.language);

    formData.append("fileUrl", this.selectedFile, this.selectedFile.name);
    console.log(formData);
    this.storeService.uploadFormData(formData).subscribe(data => {
        this.successMessage = data.body.message;
        //setTimeout(function(){ form.resetForm(); }, 500);
    }, error => {
      this.successMessage = error.error.error;
    });
  }


}
