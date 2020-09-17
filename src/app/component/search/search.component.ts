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
  displayedColumns = ['title', 'date', 'company', 'category'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('input') input: ElementRef;

  constructor(private searchService: SearchService) {}

  ngOnInit() {
    this.dataSource = new DocumentDataSource(this.searchService);
    this.dataSource.loadDocuments('', 0, 3);
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
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
}
