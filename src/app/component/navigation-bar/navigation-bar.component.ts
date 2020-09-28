import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/entity/user';
import { AuthorizationService } from '../../service/authorization.service';
import { DocumentService } from '../../service/document.service';
import { DocumentEditComponent } from '../document-edit/document-edit.component';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { Document } from '../../entity/document';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  isLoggedIn = false;
  displayName = '';
  isCurrentUploading = false;
  private loggedInUser: User = null;

  constructor(
    private http: HttpClient,
    public authorizationService: AuthorizationService,
    private documentService: DocumentService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.authorizationService
      .isLoggedInAsObservable()
      .subscribe((b) => (this.isLoggedIn = b));

    this.authorizationService.getLoggedInUser().subscribe((u) => {
      this.loggedInUser = u;
      this.displayName = u ? u.username : '';
    });
  }

  openOwnUserDialog(): void {
    const dialogRef = this.dialog.open(UserEditComponent, {
      minWidth: '600px',
      data: this.loggedInUser,
    });
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
      this.isCurrentUploading = true;

      if (fileList.length === 1) {
        this.documentService
          .uploadFile(fileList[0])
          .then((document) =>
            this.dialog.open(DocumentEditComponent, {
              minWidth: '250px',
              data: document,
              disableClose: true,
            })
          )
          .finally(() => (this.isCurrentUploading = false));
      } else {
        const promises: Promise<Document>[] = [];
        for (let index = 0; index < fileList.length; index++) {
          const element = fileList.item(index);
          this.isCurrentUploading = true;
          promises.push(this.documentService.uploadFile(element));
        }

        Promise.all(promises).finally(() => (this.isCurrentUploading = false));
      }
    }
  }
}
