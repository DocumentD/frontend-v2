import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AccessToken } from '../entity/access-token';
import { Document } from '../entity/document';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  constructor(private http: HttpClient) {}

  public openDocumentPDF(document: Document) {
    this.http
      .get<AccessToken>(
        environment.apiEndpoint + '/document/accesToken/' + document.documentid
      )
      .subscribe((data) => {
        window.open(
          environment.apiEndpoint +
            '/document/open/' +
            data.token +
            '/' +
            document.title,
          '_blank'
        );
      });
  }
}
