import { Component, OnInit} from '@angular/core';
import { StoreService } from "../store.service";
import { Script } from "../script";

@Component({
  selector: 'app-script-builder',
  templateUrl: './script-builder.component.html',
  styleUrls: ['./script-builder.component.css']
})
export class ScriptBuilderComponent implements OnInit {

  constructor(private storeService:StoreService) { }

  // Arrays to be used in *ngFor to display data
  public categories: any[];
  public script: string[];
  public scriptName: string[];
  public submitted:boolean = false;
  public responseMessage:string;

  model = new Script('',[]);

  ngOnInit() {

    // Initialize the local variables to empy arrays
    this.script = [];
    this.scriptName = [];
    this.categories  = [];

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

  modifyScript(dbEntry: any){
    if(this.script.indexOf(dbEntry.dir) == -1){
      this.script.push(dbEntry.dir);
      this.scriptName.push(dbEntry.name);
    }
    else{
      this.script.splice(this.script.indexOf(dbEntry.dir),1);
      this.scriptName.splice(this.scriptName.indexOf(dbEntry.name),1);
    }

    console.log(this.script);
  }

  submitScript(){
    console.log("submitting script");
    this.storeService.postScript(this.script, this.model.name).subscribe(response => {
      this.responseMessage = response[Object.keys(response)[0]];
    });
  }

  printInfo(dbEntry: any){
    console.log(JSON.stringify(dbEntry));
  }

}

