import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

import { Observable, Subject, throwError, pipe, of, Subscription} from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { Film } from "./film";

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class FilmComposerService {

  constructor(private http: HttpClient) { }

  private compUrl = "http://localhost:8000/compose";

  queryComposition(reqBody:Film) : Observable<any> { 
    const type = reqBody.type;
    return this.http.post(this.compUrl + `/${type}`, reqBody, httpOptions );

  }

  getTypes() : Observable<any>{
    return this.http.get(this.compUrl + '/types', httpOptions);
  }

  private log(message: string) {
    console.log('FilmComposerService: ' + message);
  }

}
