import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/entity/user';
import { AuthorizationService } from '../../service/authorization.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  displayedColumns: string[] = ['username', 'administrator', 'action'];
  dataSource: User[] = [];
  constructor() {}

  ngOnInit(): void {}

  editUser(event: any, user: User): void {
    // this.documentService.openDocumentPDF(document);
    event.stopPropagation();
  }
}
