import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { User } from 'src/app/entity/user';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit {
  form: FormGroup;
  isNew: boolean;

  mailAddresses: string[] = [];

  connectPassword = '';

  constructor(
    public dialogRef: MatDialogRef<UserEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    this.isNew = !data.username;
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group([]);
    this.mailAddresses = this.data.mailaddresses;
  }

  getNewConnectPassword(): void {
    this.userService
      .getNewConnectPassword()
      .then((password) => (this.connectPassword = password));
  }

  onClose(): void {
    this.dialogRef.close();
  }

  changePassword(): void {
    //    const dialogRef = this.dialog.open(ChangePasswordComponent, {
    //      minWidth: '600px',
    //      data: this.data,
    //    });
  }

  remove(address: string): void {
    this.userService.unconnectMailAddress(address).then(() => {
      const index = this.mailAddresses.indexOf(address);

      if (index >= 0) {
        this.mailAddresses.splice(index, 1);
      }
    });
  }
}
