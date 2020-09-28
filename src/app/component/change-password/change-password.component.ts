import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/entity/user';
import { UserService } from 'src/app/service/user.service';
import { AuthorizationService } from '../../service/authorization.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  isSumbiting = false;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private fb: FormBuilder,
    private userService: UserService,
    private authorizationService: AuthorizationService
  ) {
    this.form = this.fb.group({
      old_password: [
        null,
        [
          Validators.minLength(4),
          Validators.required,
          Validators.maxLength(128),
        ],
      ],
      new_password: [
        null,
        [
          Validators.minLength(4),
          Validators.required,
          Validators.maxLength(128),
        ],
      ],
      new_password2: [
        null,
        [
          Validators.minLength(4),
          Validators.required,
          Validators.maxLength(128),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  formSubmit(): void {
    if (this.form.valid) {
      this.isSumbiting = true;
      this.userService
        .changePassword(
          this.form.controls.old_password.value,
          this.form.controls.new_password.value
        )
        .then(() => {
          this.dialogRef.close();
          this.authorizationService.logout();
        }) // TODO Possible logout!
        .catch(() => (this.isSumbiting = false));
    }
  }

  checkPasswords(): void {
    const pass = this.form.controls.new_password.value;
    const confirmPass = this.form.controls.new_password2.value;

    if (pass !== confirmPass) {
      this.form.controls.new_password2.setErrors({ notEqual: true });
    }
  }
}
