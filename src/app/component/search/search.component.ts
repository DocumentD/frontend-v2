import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { ElementRef } from '@angular/core';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { DocumentDataSource } from '../../datasource/document-data-source';
import { SearchService } from '../../service/search.service';
import { DocumentService } from '../../service/document.service';
import { Document } from '../../entity/document';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class SearchComponent implements OnInit, AfterViewInit {
  dataSource: DocumentDataSource;
  displayedColumns = ['title', 'date', 'company', 'category', 'action'];
  pageSizeOptions = [10, 20, 30, 50];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  constructor(
    private searchService: SearchService,
    public documentService: DocumentService
  ) {}

  ngOnInit() {
    this.dataSource = new DocumentDataSource(this.searchService);
    this.dataSource.loadDocuments('', 0, this.pageSizeOptions[0]);
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(
          (prev: any, curr: any) => prev.target.value === curr.target.value
        ),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadDocumentsPage();
        })
      )
      .subscribe();

    // paginate events, load a new page
    this.paginator.page.pipe(tap(() => this.loadDocumentsPage())).subscribe();
  }

  loadDocumentsPage() {
    this.dataSource.loadDocuments(
      this.input.nativeElement.value,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }

  openDocument(event: any, document: Document): void {
    this.documentService.openDocumentPDF(document);
    event.stopPropagation();
  }
}
