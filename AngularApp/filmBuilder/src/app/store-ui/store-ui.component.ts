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

  ngOnInit() { 

    // Populate category list from server
    this.storeService.fetchCategories().subscribe(data => {
    //Fetch first key-word in the object, this is a formality to avoid errors, could use just category, since its a key in the data-object.
    const category = Object.keys(data)[0];

    var i = 0;
    data[category].forEach(element => {
      this.categories.push(Object.keys(element));
      Object.values(element).forEach(subElement => {
        this.categories[i].push(Object.keys(subElement));
      })
      i++;
    });
   })

  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
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

    this.storeService.uploadFormData(formData).subscribe(data => {
        this.successMessage = data.body.message;
        //setTimeout(function(){ form.resetForm(); }, 500);
    }, error => {
      this.successMessage = error.error.error;
    });
  }


}
