import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

import { Observable, Subject, throwError, pipe, of, Subscription} from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};


@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http: HttpClient) { }

  private storeUrl = "http://localhost:8000/upload";

  fetchCategories(){
    return this.http.get(this.storeUrl);
  }
  
  // TODO: Implement this ->
  uploadFormData(formData){
    return this.http.post(this.storeUrl, formData);
  }
}
