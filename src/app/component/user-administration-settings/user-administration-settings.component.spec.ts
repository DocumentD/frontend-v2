import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdministrationSettingsComponent } from './user-administration-settings.component';

describe('UserAdministrationSettingsComponent', () => {
  let component: UserAdministrationSettingsComponent;
  let fixture: ComponentFixture<UserAdministrationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAdministrationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAdministrationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
