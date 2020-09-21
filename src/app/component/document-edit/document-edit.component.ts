import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/entity/user';
import { DocumentService } from 'src/app/service/document.service';
import { AuthorizationService } from '../../service/authorization.service';
import { Document } from '../../entity/document';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.scss'],
})
export class DocumentEditComponent implements OnInit {
  form: FormGroup;
  sortedCategories: string[];
  filteredCategories: Observable<string[]>;
  sortedCompanies: string[];
  filteredCompanies: Observable<string[]>;
  lastDeleteClick: Date = new Date(0);

  constructor(
    public dialogRef: MatDialogRef<DocumentEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Document,
    private fb: FormBuilder,
    private documentService: DocumentService,
    private authorizationService: AuthorizationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [
        this.data.title ? this.data.title : '',
        [Validators.required, Validators.maxLength(64)],
      ],
      company: [this.data.company ? this.data.company : ''],
      category: [this.data.category ? this.data.category : ''],
      documentDate: [this.data.documentdate, [Validators.required]],
      deleteDate: [this.data.deletedate ? this.data.deletedate : ''],
    });

    this.filteredCategories = this.form.controls.category.valueChanges.pipe(
      startWith(''),
      map((value: string) =>
        this.sortedCategories.filter(
          (option) => option.toLowerCase().indexOf(value.toLowerCase()) === 0
        )
      )
    );

    this.filteredCompanies = this.form.controls.company.valueChanges.pipe(
      startWith(''),
      map((value: string) =>
        this.sortedCompanies.filter(
          (option) => option.toLowerCase().indexOf(value.toLowerCase()) === 0
        )
      )
    );

    this.authorizationService.getLoggedInUser().subscribe((user: User) => {
      this.sortedCategories = user.categories.sort();
      this.sortedCompanies = user.companies.sort();
    });
  }

  formSubmit(): void {
    if (this.form.valid) {
      // TODO Impliment
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private openErrorSnackBar(message: string): void {
    this.snackBar.open(message, null, { duration: 3000 });
  }

  onDeleteClick(): void {
    const currentDate = new Date();
    if (currentDate.getTime() - this.lastDeleteClick.getTime() > 5 * 1000) {
      this.lastDeleteClick = currentDate;
      this.openErrorSnackBar('Nochmal drücken um endgültig zu löschen!');
    } else {
      // TODO Löschen
    }
  }
}
