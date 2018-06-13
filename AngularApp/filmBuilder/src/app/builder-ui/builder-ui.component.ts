import { Component } from '@angular/core';
import { Film } from "../film";

@Component({
  selector: 'app-builder-ui',
  templateUrl: './builder-ui.component.html',
  styleUrls: ['./builder-ui.component.css']
})
export class BuilderUIComponent {

  // Available languages
  languages = ['Swedish', 'English', 'Arabic', 'Spanish', 'French', 'German'];

  model = new Film('', '', false);

  submitted = false;

  onSubmit(){
    this.submitted = true;
  }

}
