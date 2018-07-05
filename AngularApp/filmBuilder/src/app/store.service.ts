import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

import { Observable, Subject, throwError, pipe, of, Subscription} from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const formOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' })
};


@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http: HttpClient) { }

  private storeUrl = "http://localhost:8000/upload/";
  private scriptUrl = "http://localhost:8000/script/";

  fetchCategories(){
    return this.http.get(this.storeUrl);
  }
  
  uploadFormData(formData: FormData): Observable<any>{
    return this.http.post(this.storeUrl, formData, { observe: 'response' });
  }

  postScript(scriptArray: any, name: string){
    return this.http.post(this.scriptUrl + `${name}`, scriptArray);
  }
}
