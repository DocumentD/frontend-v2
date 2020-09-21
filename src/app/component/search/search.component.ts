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
import { debounceTime, distinctUntilChanged, max, tap } from 'rxjs/operators';
import { DocumentDataSource } from '../../datasource/document-data-source';
import { SearchService } from '../../service/search.service';
import { DocumentService } from '../../service/document.service';
import { Document } from '../../entity/document';
import { element } from 'protractor';
import { Match } from '../../entity/match';

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
  expandedElement: Document = null;

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
        debounceTime(250),
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

  openDocument(event: any, document: Document): void {
    this.documentService.openDocumentPDF(document);
    event.stopPropagation();
  }

  blub(doc: any) {
    console.log(doc);
    console.log(Object.keys(doc._matchesInfo).length);
  }

  hasMatchesDetials(document: Document): boolean {
    return Object.keys(document._matchesInfo).length > 0;
  }

  getMatchColumn(document: Document): string {
    if (this.hasMatchesDetials(document)) {
      return Object.keys(document._matchesInfo)[0];
    } else {
      return 'No';
    }
  }

  getMatchDetail(document: Document): string {
    if (this.hasMatchesDetials(document)) {
      const columnName = Object.keys(document._matchesInfo)[0];
      const propString: string = document[columnName].toString();
      const matches: Match[] = document._matchesInfo[columnName];

      let maxLenMatch: Match = null;

      matches.forEach((match: Match) => {
        if (maxLenMatch === null) {
          maxLenMatch = match;
        } else if (match.length > maxLenMatch.length) {
          maxLenMatch = match;
        }
      });

      const startIndex = Math.max(0, maxLenMatch.start - 10);
      const len = Math.min(propString.length - startIndex, 100);

      let str = propString.substr(startIndex, len);
      let offset = 0;
      matches.forEach((match: Match) => {
        str = this.insertAt(str, '<mark>', match.start - startIndex + offset);
        offset += 6;
        str = this.insertAt(
          str,
          '</mark>',
          match.start - startIndex + offset + match.length
        );
        offset += 7;
      });

      return ' ' + str;
    } else {
      return 'Match';
    }
  }

  private insertAt(original: string, insert: string, index: number) {
    if (original.length > index) {
      return [original.slice(0, index), insert, original.slice(index)].join('');
    } else {
      return original;
    }
  }
}
