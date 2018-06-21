import { Component, OnInit} from '@angular/core';
import { Entry } from "../entry";
import { StoreService } from "../store.service";

@Component({
  selector: 'app-store-ui',
  templateUrl: './store-ui.component.html',
  styleUrls: ['./store-ui.component.css']
})
export class StoreUIComponent implements OnInit {

  constructor(private storeService: StoreService) { }

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

  languages = ['Swedish', 'English', 'Arabic', 'Spanish', 'French', 'German'];

  types = ['Video', 'Audio', 'Subtitles'];

  onSubmit(){
    console.log(this.model);
  }


}
