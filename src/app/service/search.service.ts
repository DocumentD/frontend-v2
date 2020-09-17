import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SearchResponse } from '../entity/search-response';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: HttpClient) {}

  findDocuments(
    filter = '',
    pageNumber = 0,
    pageSize = 3
  ): Observable<SearchResponse> {
    console.log(filter);
    return this.http.get<SearchResponse>(
      environment.apiEndpoint + '/document/search',
      {
        params: new HttpParams()
          .set('search', filter)
          .set('pageNumber', pageNumber.toString())
          .set('pageSize', pageSize.toString()),
      }
    );
  }
}
