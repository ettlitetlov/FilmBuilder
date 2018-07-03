import { Component, OnInit } from '@angular/core';
import { StoreService } from "../store.service";
import { MatListModule } from "@angular/material";


@Component({
  selector: 'app-script-builder',
  templateUrl: './script-builder.component.html',
  styleUrls: ['./script-builder.component.css']
})
export class ScriptBuilderComponent implements OnInit {

  constructor(private storeService:StoreService) { }

  // Arrays to be used in *ngFor to display data
  public categories: any[] = [];

  ngOnInit() {
    // Fetch categories from database to populate selection list
    this.storeService.fetchCategories().subscribe(data => {
      //Fetch first key-word in the object, this is a formality to avoid errors, could use just category, since its a key in the data-object.
      const category = Object.keys(data)[0];

      var i = 0;
      data[category].forEach(element => {
        this.categories.push(Object.keys(element));

        Object.values(element).forEach(subElement => {
          var j = 2;
          this.categories[i].push(Object.keys(subElement));
          Object.values(subElement).forEach(subSubElement => {


            if(subSubElement.Video[0]){
              subSubElement.Video.forEach( d => {
                if(this.categories[i][j]){
                  this.categories[i][j].push(d);
                }
                else
                  this.categories[i].push(new Array(d));
              });
              j++
            }
          })
        })
        i++;
      });
    });
  }

  printInfo(dbEntry: any){
    console.log(JSON.stringify(dbEntry));
  }

}
