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
  loggedInUser: User;

  constructor(
    private authorizationService: AuthorizationService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authorizationService
      .getLoggedInUser()
      .subscribe((u) => (this.loggedInUser = u));
  }
}
