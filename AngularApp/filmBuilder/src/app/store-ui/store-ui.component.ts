import { Component} from '@angular/core';
import { Entry } from "../entry";

@Component({
  selector: 'app-store-ui',
  templateUrl: './store-ui.component.html',
  styleUrls: ['./store-ui.component.css']
})
export class StoreUIComponent {

  constructor() { }

  model = new Entry('','','','')

  categories = ['Info', 'Transition', 'Text Segment', 'Dialog', 'Movement'];

  languages = ['Swedish', 'English', 'Arabic', 'Spanish', 'French', 'German'];

  types = ['Film', 'Audio', 'Subtitles'];

  onSubmit(){
    console.log(this.model);
  }


}
