import { Component, OnInit } from '@angular/core';
import { Film } from "../film";
import { FilmComposerService } from "../film-composer.service";

@Component({
  selector: 'app-builder-ui',
  templateUrl: './builder-ui.component.html',
  styleUrls: ['./builder-ui.component.css']
})
export class BuilderUIComponent implements OnInit {

  constructor(private filmComposer: FilmComposerService) { }
  private submitted:boolean;
  private types:string[];

  ngOnInit(){
    this.filmComposer.getTypes().subscribe(data => {
      this.types = data;
    })
    this.submitted = false;
  }

  // Available languages
  languages = ['Swedish', 'English', 'Arabic', 'Spanish', 'French', 'German'];

  // Available formats
  formats = ['.mp4', '.mov', '.avi', '.mkv'];

  // Available resolutions
  resulotions = [1080, 720, 576, 432, 360, 144];

  model = new Film('', '', '.mp4',1080,'', false);


  message:string = "";

  // Send request to API, will not be sent multiple times if button pressed multiple times.
  onSubmit(){
    if(!this.submitted){
      if(this.model.res == 'GameBoy')
        this.model.res = 144;
      this.message = "";
      this.submitted = true;
      this.filmComposer.queryComposition(this.model).subscribe(data => {
        this.message = data.message;
        this.submitted = false;
      },
      error => {
        this.message = error.error.message;
        this.submitted = false;
      });
    }
  }

}
