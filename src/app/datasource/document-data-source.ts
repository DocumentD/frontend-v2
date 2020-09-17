import { CollectionViewer } from '@angular/cdk/collections';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { SearchService } from '../service/search.service';
import { SearchResponse } from '../entity/search-response';

export class DocumentDataSource implements DataSource<Document> {
  private documentSubject = new BehaviorSubject<Document[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private documentsSizeSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();
  public documentsSize$ = this.documentsSizeSubject.asObservable();

  constructor(private searchService: SearchService) {}

  connect(collectionViewer: CollectionViewer): Observable<Document[]> {
    return this.documentSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.documentSubject.complete();
    this.loadingSubject.complete();
  }

  loadDocuments(filter = '', pageIndex = 0, pageSize = 3) {
    this.loadingSubject.next(true);

    this.searchService
      .findDocuments(filter, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((search: SearchResponse) => {
        this.documentSubject.next(search.hits);
        this.documentsSizeSubject.next(search.nbHits);
      });
  }
}
