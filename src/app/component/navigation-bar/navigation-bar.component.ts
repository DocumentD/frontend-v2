import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '../../service/authorization.service';
import { DocumentService } from '../../service/document.service';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  isLoggedIn = false;

  constructor(
    private http: HttpClient,
    public authorizationService: AuthorizationService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.authorizationService
      .isLoggedInAsObservable()
      .subscribe((b) => (this.isLoggedIn = b));
  }

  openFileDialog(): void {
    document.querySelector('input').click();
  }

  handle(event: Event): void {
    if (
      (event.target as HTMLInputElement).files &&
      (event.target as HTMLInputElement).files.length
    ) {
      const fileList: FileList = (event.target as HTMLInputElement).files;
      for (let index = 0; index < fileList.length; index++) {
        const element = fileList.item(index);
        this.documentService.uploadFile(element);
      }
    }
  }
}
